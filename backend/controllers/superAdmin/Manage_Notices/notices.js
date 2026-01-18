const db = require('../../../models/index');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const addnotice = async (req, res) => {
    try {
        const { title, hostelNo } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const fileUrl = `${req.protocol}://${req.get('host')}/public/uploads/${file.filename}`;

        const newNotice = await db.notices.create({
            title: title,
            url: fileUrl,
            public_id: uuidv4(),
            hostelNo: null,
            isGlobal: true
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

const getNotices = async (req, res) => {
    try {
        const result = await db.notices.findAll({
            attributes: ['title', 'url', 'public_id', 'createdAt', 'isGlobal', 'hostelNo'],
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

        const fileName = path.basename(notice.url);
        const filePath = path.join(
            __dirname,
            '../../../public/uploads',
            fileName
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Force browser download
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