const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try{ 
        const token = req.headers.authorization
        const decoded = jwt.verify(token, process.env.jwt_secret)
        req.user_data = decoded
        console.log('Authorized request: ' + JSON.stringify(decoded))
    }catch(err) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized request'
        })
    }
    next()
}