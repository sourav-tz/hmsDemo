const db = require('../../../models/index');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const addnotice = async (req, res) => {
    try {
        // Bug fix by Ravi: Bug 23 - description field was missing; Bug 26 - priority and expiresAt missing for rich notice workflow
        // Bug fix by Ravi: Bug 12 - SA could not select audience; always forced isGlobal=true
        // Bug fix by Ravi: Bug 13 - No multi-hostel support; single notice row per hostel via loop
        // Bug fix by Ravi: Bug 25 - Boys/Girls hostel category targeting was missing
        const { title, audience, description, priority, expiresAt } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const fileUrl = `${process.env.API_BASE_URL}/public/uploads/${file.filename}`;

        // audience values: 'all' | 'boys' | 'girls' | comma-separated hostelNo list e.g. '11,12'
        if (!audience || audience === 'all') {
            // Bug fix by Ravi: Bug 12 - was always hardcoded isGlobal: true with no way to target specific hostels
            await db.notices.create({
                title,
                url: fileUrl,
                public_id: uuidv4(),
                hostelNo: null,
                isGlobal: true,
                description: description || null,
                priority: priority || 'medium',
                expiresAt: expiresAt || null,
            });
        } else if (audience === 'boys' || audience === 'girls') {
            // Bug fix by Ravi: Bug 25 - Boys/Girls hostel category targeting was missing; fetches all matching hostels and creates one notice per hostel
            const type = audience === 'boys' ? 'Boys' : 'Girls';
            const targetHostels = await db.hostels.findAll({ where: { type } });
            for (const h of targetHostels) {
                await db.notices.create({
                    title,
                    url: fileUrl,
                    public_id: uuidv4(),
                    hostelNo: h.hostelNo,
                    isGlobal: false,
                    description: description || null,
                    priority: priority || 'medium',
                    expiresAt: expiresAt || null,
                });
            }
        } else {
            // Bug fix by Ravi: Bug 13 - Multi-hostel selection was missing; audience is comma-separated hostelNo list
            const hostelList = String(audience).split(',').map(n => parseInt(n.trim())).filter(Boolean);
            for (const hNo of hostelList) {
                await db.notices.create({
                    title,
                    url: fileUrl,
                    public_id: uuidv4(),
                    hostelNo: hNo,
                    isGlobal: false,
                    description: description || null,
                    priority: priority || 'medium',
                    expiresAt: expiresAt || null,
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Notice uploaded successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to upload notice',
        });
    }
};

const getNotices = async (req, res) => {
    try {
        const result = await db.notices.findAll({
            attributes: ['title', 'url', 'public_id', 'createdAt', 'isGlobal', 'hostelNo', 'description', 'priority', 'expiresAt'],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            result,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get notices',
        });
    }
};

const deleteNotices = async (req, res) => {
    try {
        const { public_id } = req.body;

        const notice = await db.notices.findOne({ where: { public_id } });
        if (!notice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }

        const fileName = path.basename(notice.url);
        const filePath = path.join(
            __dirname,
            '../../../public/uploads',
            fileName
        );
        // Bug fix by Ravi: Bug 3 - With soft-delete (paranoid: true) the file should NOT be deleted from disk to allow recovery
        // if (fs.existsSync(filePath)) {
        //     fs.unlinkSync(filePath);
        // }

        await db.notices.destroy({ where: { public_id } });

        return res.status(200).json({
            success: true,
            message: 'Notice deleted successfully'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete notice'
        });
    }
};

const downloadNotice = async (req, res) => {
    try {
        const { public_id } = req.params;

        const notice = await db.notices.findOne({ where: { public_id } });
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }

        const fileName = path.basename(notice.url);
        const filePath = path.join(
            __dirname,
            '../../../public/uploads',
            fileName
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${fileName}"`
        );

        return res.download(filePath);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Download failed' });
    }
};

// Bug fix by Ravi: Bug 15 - No edit/update function existed for notices; only title and description are editable (file stays the same)
const editNotice = async (req, res) => {
    try {
        const { public_id, title, description, priority, expiresAt } = req.body;
        if (!public_id) {
            return res.status(400).json({ success: false, message: 'public_id is required' });
        }
        const notice = await db.notices.findOne({ where: { public_id } });
        if (!notice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }
        await db.notices.update(
            { title, description, priority, expiresAt },
            { where: { public_id } }
        );
        return res.status(200).json({ success: true, message: 'Notice updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to update notice' });
    }
};

module.exports = {
    addnotice,
    getNotices,
    deleteNotices,
    downloadNotice,
    editNotice,
};
