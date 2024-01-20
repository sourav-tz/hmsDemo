

const auth = (req, res, next) => {

    try {
        const token = req.headers.cookie

        if (!token) {
            return res.status(401).json({ message: 'Token is expired you can logout' })

        }



    } catch (error) {
        res.status(401).json({ message: error.message });
    }

}

module.exports = auth