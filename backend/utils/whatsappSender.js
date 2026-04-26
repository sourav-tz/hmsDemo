const axios = require('axios');

const GRAPH_API_URL = 'https://graph.facebook.com/v19.0';

/**
 * Send a plain text message via WhatsApp Cloud API
 * @param {string} to - Recipient phone number with country code (no +)
 * @param {string} text - Message body
 */
const sendWhatsApp = async (to, text) => {
    try {
        await axios.post(
            `${GRAPH_API_URL}/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to,
                type: 'text',
                text: { body: text },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        const detail = error.response
            ? JSON.stringify(error.response.data)
            : error.message;
        console.error(`[WhatsApp] Failed to send message to ${to}:`, detail);
        throw error;
    }
};

/**
 * Resolve a WhatsApp media_id to a temporary CDN URL
 * @param {string} mediaId - The media_id from the webhook payload
 * @returns {Promise<string>} - The temporary media URL
 */
const resolveMediaUrl = async (mediaId) => {
    const { data } = await axios.get(`${GRAPH_API_URL}/${mediaId}`, {
        headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
    });
    return data.url;
};

/**
 * Download WhatsApp media as a Buffer
 * @param {string} mediaUrl - The URL from resolveMediaUrl
 * @returns {Promise<Buffer>}
 */
const downloadMediaBuffer = async (mediaUrl) => {
    const response = await axios.get(mediaUrl, {
        responseType: 'arraybuffer',
        headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
    });
    return Buffer.from(response.data);
};

module.exports = { sendWhatsApp, resolveMediaUrl, downloadMediaBuffer };
