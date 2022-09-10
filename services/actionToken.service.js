const {ActionTokens} = require('../dataBase')
module.exports = {
    createActionToken: (dataToInsert) => {
        return ActionTokens.create(dataToInsert);
    },
    getOneByParamsWithUser: (searchParams) => {
        return ActionTokens.findOne(searchParams).populate('user');
    },
    deleteMany: (deleteParams) => {
        return ActionTokens.deleteMany(deleteParams);
    },
    deleteOne: (deleteParams) => {
        return ActionTokens.deleteOne(deleteParams);
    }
}