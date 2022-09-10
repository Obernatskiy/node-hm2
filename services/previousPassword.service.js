const {PreviousPassword} = require('../dataBase')
const {date} = require("joi");

module.exports = {
    savePasswordInfo(oldPassInfo) {
        return PreviousPassword.create(oldPassInfo)
    },

    getByUserId(userId) {
        return PreviousPassword.findOne({user:userId}).lean();
    },
    deleteManyBeforeDate(date) {
        return PreviousPassword.deleteMany({createdAt:{$lt:date}});
    },
};