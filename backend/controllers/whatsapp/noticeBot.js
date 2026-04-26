const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary');
const db = require('../../models');
const { sendWhatsApp, resolveMediaUrl, downloadMediaBuffer } = require('../../utils/whatsappSender');
const { sendNoticeEmailsToStudents } = require('../../utils/noticeEmailService');

// ─── Session store ────────────────────────────────────────────────────────────
// step: 'idle' | 'awaiting_title' | 'awaiting_scope' | 'awaiting_image' | 'awaiting_rollno'
const sessions = {};

// ─── NLP: Intent detection ────────────────────────────────────────────────────

const INTENT_KEYWORDS = {
    notice: [
        'notice', 'upload notice', 'add notice', 'post notice', 'new notice',
        'create notice', 'circular', 'announcement', 'notice upload', 'notice post',
        'notice add', 'notice debo', 'notice pathabo', 'notice korbo', 'notis',
    ],
    student: [
        'student', 'student info', 'student detail', 'student data', 'roll no',
        'roll number', 'student information', 'student er details', 'student dekho',
        'student khojo', 'find student', 'search student', 'student profile',
        'student record', 'student er info', 'info of student', 'i need student',
        'student er', 'student check',
    ],
    complaints: [
        'complaint', 'complaints', 'pending complaint', 'pending complaints',
        'issue', 'issues', 'grievance', 'show complaint', 'view complaint',
        'complain', 'pending', 'complaint list', 'complaint dekho', 'complaint dekhao',
        'complaints dekhao', 'complaint show', 'pending issues', 'student complaint',
    ],
    cancel: [
        'cancel', 'stop', 'quit', 'reset', 'start over', 'nevermind',
        'nothing', 'exit', 'back', 'cancel koro', 'bado', 'jay', 'jaak',
    ],
};

const detectIntent = (text) => {
    const t = text.toLowerCase().trim();
    for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
        if (keywords.some((kw) => t.includes(kw))) return intent;
    }
    return null;
};

const isGreeting = (text) => {
    const greetings = ['hi', 'hello', 'hey', 'helo', 'hii', 'hiii', 'yo', 'sup', 'help', 'start'];
    return greetings.includes(text.toLowerCase().trim());
};

// ─── Caller identification ────────────────────────────────────────────────────

const extractMobile = (waPhone) => waPhone.slice(-10);

const identifyCaller = async (waPhone) => {
    const mobile = extractMobile(waPhone);
    const ha = await db.hostelauthoritys.findOne({
        where: { mobile, isActive: true },
        attributes: ['email', 'hostelNo'],
    });
    if (ha) return { role: 'HA', hostelNo: ha.hostelNo };
    return { role: 'SA', hostelNo: null };
};

// ─── Response formatters ──────────────────────────────────────────────────────

const formatStudentDetails = (student) => {
    const p = student.profile;
    const lines = [
        `👤 *Student Details*\n`,
        `📛 *Name:* ${student.firstName} ${student.lastName}`,
        `🔢 *Roll No:* ${student.rollNo}`,
        `📧 *Email:* ${student.email}`,
        `📅 *Year:* ${student.year}`,
        `🏠 *Hostel:* #${student.hostelNo ?? 'N/A'}`,
        `🚪 *Room:* ${student.roomId ?? 'Not allotted'}`,
        `📚 *Course:* ${student.course?.courseName ?? 'N/A'}`,
    ];
    if (p) {
        lines.push('');
        if (p.contactNumber) lines.push(`📞 *Contact:* ${p.contactNumber}`);
        if (p.dob)           lines.push(`🎂 *DOB:* ${p.dob}`);
        if (p.bloodGroup)    lines.push(`🩸 *Blood:* ${p.bloodGroup}`);
        if (p.gender)        lines.push(`⚧ *Gender:* ${p.gender}`);
        if (p.fatherName)    lines.push(`👨 *Father:* ${p.fatherName}`);
        if (p.city)          lines.push(`📍 *City:* ${p.city}${p.state ? `, ${p.state}` : ''}`);
    }
    return lines.join('\n');
};

const formatComplaints = (complaints, scopeLabel) => {
    if (!complaints.length) {
        return `Great news — no pending complaints for *${scopeLabel}* right now! 🎉`;
    }
    const MAX = 10;
    const shown = complaints.slice(0, MAX);
    const lines = [`📣 *Pending Complaints — ${scopeLabel}*\n`];
    shown.forEach((c, i) => {
        const date = new Date(c.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
        });
        lines.push(
            `*${i + 1}.* [${c.tag ?? 'General'}] ${c.subject}`,
            `   Roll: ${c.rollNo}  |  ${date}`,
            `   _${(c.description ?? '').slice(0, 80)}_`,
            ''
        );
    });
    if (complaints.length > MAX) lines.push(`_…and ${complaints.length - MAX} more_`);
    lines.push(`\nTotal pending: *${complaints.length}*`);
    return lines.join('\n');
};

// ─── Scope resolution helpers ─────────────────────────────────────────────────

const MINE_WORDS  = ['mine', 'my hostel', 'only mine', 'hostel only', 'my', 'amar', 'amar hostel', '1', 'yes', 'this hostel', 'only my'];
const GLOBAL_WORDS = ['all', 'global', 'everyone', 'all hostel', 'all hostels', 'sobar', 'sob', '2', 'every hostel', 'sabai'];

const resolveHAScope = (text) => {
    const t = text.toLowerCase().trim();
    if (MINE_WORDS.some((w) => t.includes(w))) return 'mine';
    if (GLOBAL_WORDS.some((w) => t.includes(w))) return 'global';
    return null;
};

const resolveSAScope = (text) => {
    const t = text.toLowerCase().trim();
    if (GLOBAL_WORDS.some((w) => t.includes(w))) return { isGlobal: true, hostelNo: null };
    const num = parseInt(t, 10);
    if (!isNaN(num) && num > 0) return { isGlobal: false, hostelNo: num };
    return null;
};

// ─── Webhook verification (GET) ───────────────────────────────────────────────

const verifyWebhook = (req, res) => {
    const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
        console.log('[WhatsApp] Webhook verified');
        return res.status(200).send(challenge);
    }
    console.warn('[WhatsApp] Webhook verification failed');
    return res.sendStatus(403);
};

// ─── Main webhook handler (POST) ─────────────────────────────────────────────

const handleWebhook = async (req, res) => {
    res.sendStatus(200);

    try {
        const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
        if (!message) return;

        const from    = message.from;
        const msgType = message.type;
        const text    = msgType === 'text' ? message.text.body.trim() : '';

        // ── Identify caller (once per session) ───────────────────────────
        if (!sessions[from]) {
            const { role, hostelNo } = await identifyCaller(from);
            sessions[from] = { step: 'idle', role, haHostelNo: hostelNo };
        }

        const session = sessions[from];

        // ── Cancel mid-flow ───────────────────────────────────────────────
        if (text && detectIntent(text) === 'cancel' && session.step !== 'idle') {
            session.step = 'idle';
            await sendWhatsApp(from, "No problem, cancelled! What else can I help you with?");
            return;
        }

        // ─────────────────────────────────────────────────────────────────
        // IDLE — detect intent from natural message
        // ─────────────────────────────────────────────────────────────────
        if (session.step === 'idle') {
            if (msgType !== 'text' || !text) {
                await sendWhatsApp(from,
                    "Hey there! 👋 I can help you with:\n\n" +
                    "• Uploading a *notice*\n" +
                    "• Looking up *student details*\n" +
                    "• Viewing *pending complaints*\n\n" +
                    "Just tell me what you need!"
                );
                return;
            }

            const intent = detectIntent(text);

            if (isGreeting(text) && !intent) {
                await sendWhatsApp(from,
                    `Hey! 👋 What can I do for you?\n\n` +
                    `I can help with uploading notices, student info, or pending complaints — just let me know.`
                );
                return;
            }

            if (intent === 'notice') {
                session.step = 'awaiting_title';
                await sendWhatsApp(from, "Sure! What's the title for the notice?");

            } else if (intent === 'student') {
                session.step = 'awaiting_rollno';
                await sendWhatsApp(from, "Got it! What's the student's roll number?");

            } else if (intent === 'complaints') {
                await handleComplaints(from, session);

            } else {
                await sendWhatsApp(from,
                    "Hmm, I didn't quite get that. 🤔\n\n" +
                    "I can help you with:\n" +
                    "• Uploading a *notice*\n" +
                    "• Looking up *student details*\n" +
                    "• Viewing *pending complaints*\n\n" +
                    "Just say what you need!"
                );
            }
            return;
        }

        // ─────────────────────────────────────────────────────────────────
        // NOTICE FLOW
        // ─────────────────────────────────────────────────────────────────

        if (session.step === 'awaiting_title') {
            if (msgType !== 'text' || !text) {
                await sendWhatsApp(from, "Please type the notice title as a text message.");
                return;
            }
            session.title = text;
            session.step  = 'awaiting_scope';

            if (session.role === 'HA') {
                await sendWhatsApp(from,
                    `Got it — *"${text}"*!\n\n` +
                    `Should this notice go to just *your hostel (#${session.haHostelNo})* or *all hostels*?\n\n` +
                    `Say *mine* or *all*.`
                );
            } else {
                await sendWhatsApp(from,
                    `Got it — *"${text}"*!\n\n` +
                    `Should this go to *all hostels*, or a *specific hostel*?\n\n` +
                    `Say *all* or send a hostel number like *3*.`
                );
            }
            return;
        }

        if (session.step === 'awaiting_scope') {
            if (msgType !== 'text' || !text) {
                await sendWhatsApp(from, session.role === 'HA'
                    ? `Say *mine* for your hostel only or *all* for all hostels.`
                    : `Say *all* for all hostels or send a hostel number like *3*.`
                );
                return;
            }

            if (session.role === 'HA') {
                const scope = resolveHAScope(text);
                if (scope === 'mine') {
                    session.isGlobal      = false;
                    session.uploadHostelNo = session.haHostelNo;
                } else if (scope === 'global') {
                    session.isGlobal      = true;
                    session.uploadHostelNo = null;
                } else {
                    await sendWhatsApp(from, `I didn't catch that. Say *mine* for your hostel or *all* for all hostels.`);
                    return;
                }
            } else {
                const scope = resolveSAScope(text);
                if (!scope) {
                    await sendWhatsApp(from, `Say *all* for all hostels, or send a hostel number like *3*.`);
                    return;
                }
                const { isGlobal, hostelNo } = scope;
                if (!isGlobal) {
                    const exists = await db.hostels.findByPk(hostelNo);
                    if (!exists) {
                        await sendWhatsApp(from, `Hostel #${hostelNo} doesn't exist. Try another number or say *all*.`);
                        return;
                    }
                }
                session.isGlobal      = isGlobal;
                session.uploadHostelNo = hostelNo;
            }

            session.step = 'awaiting_image';
            const target = session.isGlobal ? 'all hostels' : `Hostel #${session.uploadHostelNo}`;
            await sendWhatsApp(from, `Perfect! Sending to *${target}*. Now send me the *notice image*. 🖼️`);
            return;
        }

        if (session.step === 'awaiting_image') {
            if (msgType !== 'image') {
                await sendWhatsApp(from, "I'm waiting for the notice *image*. Please send a photo.");
                return;
            }

            await sendWhatsApp(from, "Uploading your notice... ⏳");

            const mediaUrl    = await resolveMediaUrl(message.image.id);
            const imageBuffer = await downloadMediaBuffer(mediaUrl);
            const base64      = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

            const uploadResult = await cloudinary.v2.uploader.upload(base64, {
                folder: 'notices',
                resource_type: 'image',
            });

            await db.notices.create({
                public_id:  uuidv4(),
                title:      session.title,
                url:        uploadResult.secure_url,
                details:    null,
                uploadedBy: session.role,
                isGlobal:   session.isGlobal,
                hostelNo:   session.uploadHostelNo,
            });

            const uploadedByLabel = session.role === 'HA' ? 'Hostel Admin' : 'Super Admin';
            sendNoticeEmailsToStudents({
                noticeTitle:    session.title,
                noticeUrl:      uploadResult.secure_url,
                uploadedByLabel,
                hostelNo:       session.uploadHostelNo,
                isGlobal:       session.isGlobal,
            }).then((s) => console.log('[WhatsApp Notice] Email summary:', s))
              .catch((e) => console.error('[WhatsApp Notice] Email error:', e.message));

            const target = session.isGlobal ? 'all hostels' : `Hostel #${session.uploadHostelNo}`;
            session.step = 'idle';
            delete session.title;
            delete session.isGlobal;
            delete session.uploadHostelNo;

            await sendWhatsApp(from,
                `✅ Done! Notice *"${session.title ?? ''}"* has been uploaded and students will be notified.\n` +
                `📢 Audience: *${target}*\n\n` +
                `Anything else I can help with?`
            );
            return;
        }

        // ─────────────────────────────────────────────────────────────────
        // STUDENT DETAILS FLOW
        // ─────────────────────────────────────────────────────────────────

        if (session.step === 'awaiting_rollno') {
            if (msgType !== 'text' || !text) {
                await sendWhatsApp(from, "Please send the student's roll number.");
                return;
            }

            const rollNo = parseInt(text, 10);
            if (isNaN(rollNo)) {
                await sendWhatsApp(from, `That doesn't look like a valid roll number. Please send a numeric roll number.`);
                return;
            }

            const where = { rollNo };
            if (session.role === 'HA') where.hostelNo = session.haHostelNo;

            const student = await db.students.findOne({
                where,
                include: [
                    { model: db.profiles, required: false },
                    { model: db.courses, attributes: ['courseName'], required: false },
                ],
            });

            session.step = 'idle';

            if (!student) {
                const hint = session.role === 'HA' ? ' in your hostel' : '';
                await sendWhatsApp(from,
                    `Couldn't find a student with roll number *${rollNo}*${hint}. Double-check and try again.\n\nAnything else I can help with?`
                );
                return;
            }

            await sendWhatsApp(from, formatStudentDetails(student));
            await sendWhatsApp(from, "Anything else I can help with?");
            return;
        }

        // Fallback
        session.step = 'idle';
        await sendWhatsApp(from,
            "I'm not sure what you meant. I can help with:\n\n" +
            "• Uploading a *notice*\n" +
            "• Looking up *student details*\n" +
            "• Viewing *pending complaints*"
        );

    } catch (error) {
        console.error('[WhatsApp] Error processing webhook:', error.message || error);
    }
};

// ─── Complaints (inline, not a step) ─────────────────────────────────────────

const handleComplaints = async (from, session) => {
    const where = { status: 'pending' };
    let scopeLabel;

    if (session.role === 'HA') {
        where.hostelNo = session.haHostelNo;
        scopeLabel = `Hostel #${session.haHostelNo}`;
    } else {
        scopeLabel = 'All Hostels';
    }

    const complaints = await db.complaints.findAll({
        where,
        order: [['createdAt', 'DESC']],
        attributes: ['complaintId', 'subject', 'tag', 'description', 'status', 'rollNo', 'hostelNo', 'createdAt'],
    });

    session.step = 'idle';
    await sendWhatsApp(from, formatComplaints(complaints, scopeLabel));
    await sendWhatsApp(from, "Anything else I can help with?");
};

module.exports = { verifyWebhook, handleWebhook };
