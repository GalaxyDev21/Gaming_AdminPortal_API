const jwt = require('express-jwt');
const jwtutils ={
    generateAccesstoken: function(userData, scerect) {
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + 1000);
        return jwt.sign(
            {
                email: userData.email,
                id: userData._id,
                name: userData.name,
                role: userData.role,
                exp: parseInt(expirationDate.getTime() / 1000, 10)
            },
            scerect
        );
    }
}
module.exports = jwtutils;