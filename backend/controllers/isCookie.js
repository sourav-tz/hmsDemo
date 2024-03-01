
const isCookie = async (req, res) => {
    try {
        const cookie = req.headers.cookie;
        if (!cookie) {
            return res.status(400).json({ cookie: false });
        }

        res.status(200).json({ cookie: true });

    } catch (err) {
        res.status(401).json({ error: err.message });
    }

}

module.exports = isCookie; 


