const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET, (err, decoded) => {

        if(err) {

            // RETURN ERROR
            return res.status(404).json({
                message: 'Token errores'
            });

        } else {

            req.userData = decoded;
            next();

        }   

    });
        
};