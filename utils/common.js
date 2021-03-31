const mongoose = require('mongoose');
const Users = mongoose.model('Users');

const common ={
    isRole: async function(userID, roleName) {
        const user = await Users.findById({ _id: userID}).then(data => data);
        return user.role === roleName;
    },
    isSysemRole: async function(userID) {
        const user = await Users.findById({ _id: userID}).then(data => data);
        return user.role === "manager" || user.role === "superadmin";
    },
    curentUser: async function(userID) {
        return await Users.findById({ _id: userID}).then(data => data);
    }
}
module.exports = common;