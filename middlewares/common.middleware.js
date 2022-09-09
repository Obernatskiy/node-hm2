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
    },

    checkIsUserBodyValid: (validatorType) => async (req, res, next) => {
        try {

            const validate = validatorType.validate(req.body);

            if (validate.error){
                return next(new ApiError(validate.error.message, statusCodes.BAD_REQUEST))
            }

            req.body = validate.value;
            next();
        } catch (e) {
            next(e)
        }
    },
}