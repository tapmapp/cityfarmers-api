const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET, (err, decoded) => {

        if(err) {

            // RETURN ERROR
            return res.status(404).json({
                err: err,
                message: 'Token error', 
                token: token
            });

        } else {

            req.userData = decoded;
            next();

        }   

    });
        
};