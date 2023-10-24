const jwt = require('jsonwebtoken')

const createJWTToken = (user) => {
    return jwt.sign({user}, "Verveine", {
        expiresIn: "1d",
    })
}

module.exports = {
    createJWTToken,
}