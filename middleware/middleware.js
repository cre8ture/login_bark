const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt; // Or however you choose to send the token

    if (!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            console.log(err.message);
            return res.redirect('/login');
        }

        req.user = decodedToken; // Optional: Add decoded token to request
        next();
    });
};

module.exports = verifyToken; // Exporting as a single function
