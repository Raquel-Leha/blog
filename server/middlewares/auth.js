const jwt = require('jsonwebtoken')

const authenticate = (req,res,next) => {
    const token = req.headers.authorization?.split(" ")[1]
    console.log(token);
    try {
        const verified = jwt.verify(token, 'Verveine')
        req.verifiedUser = verified.user;
        next()
        
    } catch (error) {
        next()
    }

}

module.exports = {
    authenticate
}