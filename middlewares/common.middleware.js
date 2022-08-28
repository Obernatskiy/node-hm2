const {isObjectIdOrHexString} = require('mongoose');
const {statusCodes} = require("../constants");
const {ApiError} = require("../errors");


module.exports = {
    checkIsIdValid: (fieldName, from = 'params') => async (req, res, next) => {
        try {
            if (!isObjectIdOrHexString(req[from][fieldName])) {
                return next(throw new ApiError('Not valid ID', statusCodes.BAD_REQUEST));
            }

            next();
        } catch (e) {
            next(e)
        }
    }
}