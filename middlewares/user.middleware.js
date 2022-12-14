const {ApiError} = require('../errors');
const {statusCodes} = require('../constants');
const {userService} = require('../services');
const {User} = require('../dataBase/User');


module.exports = {


    checkIsUserEmailUniq: async (req, res, next) => {
        try {
            const {email} = req.body;
            const {userId} = req.params;

            const userByEmail = await userService.getOneByParams({email:{$ne:userId}});

            if (userByEmail) {
                return next(new ApiError('User with this email is exist', statusCodes.CONFLICT));
            }

            next();
        } catch (e) {
            next(e)
        }
    },

    isUserPresent: (from = 'params') => async (req, res, next) => {
        try {
            const {userId} = req[from];

            const user = await userService.getOneById(userId);

            if (!user) {
                return next(new ApiError('User not found', statusCodes.NOT_FOUND));
            }

            req.user = user;
            next();
        } catch (e) {
            next(e)
        }
    },

    getUserDynamicaly: (from = 'body', fieldName = 'userId', dbField = fieldName) =>
        async (req, res, next) => {
            try {
                const fieldToSearch = req[from][fieldName];

                const user = await User.findOne({[dbField]: fieldToSearch});


                if (!user) {
                    return next(new ApiError('User not found', statusCodes.NOT_FOUND));
                }

                req.user = user;
                next();
            } catch (e) {
                next(e)
            }
        }
}