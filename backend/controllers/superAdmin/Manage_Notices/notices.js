const db = require('../../../models/index');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const axios = require('axios');
const { sendNoticeEmailsToStudents } = require('../../../utils/noticeEmailService');

const addnotice = async (req, res) => {
    try {
        const { title, details } = req.body;
        const file = req.file;
        const isGlobal = String(req.body.isGlobal).toLowerCase() !== 'false';
        const hostelNoValue = req.body.hostelNo;
        const hostelNo = hostelNoValue !== undefined && hostelNoValue !== null && hostelNoValue !== ''
            ? Number(hostelNoValue)
            : null;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        if (!isGlobal && !hostelNo) {
            return res.status(400).json({ success: false, message: 'Hostel number is required for hostel-specific notice' });
        }

        const fileUrl = `${req.protocol}://${req.get('host')}/public/uploads/${file.filename}`;

        const newNotice = await db.notices.create({
            title: title,
            url: fileUrl,
            details: details || null,
            public_id: uuidv4(),
            hostelNo: isGlobal ? null : hostelNo,
            isGlobal,
            uploadedBy: 'SA'
        });

        const uploadedByLabel = req.body.tokenEmail
            ? `Super Admin (${req.body.tokenEmail})`
            : 'Super Admin';

        sendNoticeEmailsToStudents({
            noticeTitle: title,
            noticeUrl: fileUrl,
            uploadedByLabel,
            hostelNo: isGlobal ? null : hostelNo,
            isGlobal,
        })
            .then((summary) => {
                console.log('Notice email dispatch summary (SA):', summary);
            })
            .catch((mailError) => {
                console.error('Notice email dispatch failed (SA):', mailError);
            });

        return res.status(200).json({
            success: true,
            message: 'Notice uploaded successfully',
            data: newNotice,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to upload notice',
        });
    }
};

const getNotices = async (_req, res) => {
    try {
        const result = await db.notices.findAll({
            attributes: ['title', 'url', 'details', 'public_id', 'createdAt', 'isGlobal', 'hostelNo'],
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

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await db.notices.destroy({ where: { public_id } });

        return res.status(200).json({
            success: true,
            message: 'Notice and file deleted successfully'
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

        // Notices uploaded via WhatsApp (Cloudinary) have an external URL.
        // Local uploads always contain '/public/uploads/' in their URL.
        // For external URLs, stream the file with Content-Disposition: attachment
        // so the browser forces a download instead of opening the file.
        if (!notice.url.includes('/public/uploads/')) {
            const fileResponse = await axios.get(notice.url, { responseType: 'stream' });
            const ext = path.extname(new URL(notice.url).pathname) || '.jpg';
            const safeTitle = notice.title.replace(/[^a-z0-9_\-]/gi, '_');
            res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}${ext}"`);
            res.setHeader('Content-Type', fileResponse.headers['content-type'] || 'application/octet-stream');
            return fileResponse.data.pipe(res);
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

module.exports = {
    addnotice,
    getNotices,
    deleteNotices,
    downloadNotice 
};
