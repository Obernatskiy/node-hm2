const {constant, statusCodes, tokenTypeEnum} = require("../constants");
const {ApiError} = require("../errors");
const {authService, tokenService, ActionTokenService, previousPasswordService} = require("../services");


module.exports = {
    checkIsAccessToken: async (req, res, next) => {
        try {

            const access_token = req.get(constant.AUTHORIZATION);
            if (!access_token) {
                return next(new ApiError('No token', statusCodes.UNAUTHORIZED));
            }

            tokenService.checkToken(access_token);

            const tokenInfo = await authService.getOneWithUser({access_token});
            if (!tokenInfo) {
                return next(new ApiError('Not valid token', statusCodes.UNAUTHORIZED))
            }

            req.tokenInfo = tokenInfo;

            next();
        } catch (e) {
            next(e)
        }
    },

    checkIsActionToken: (tokenType) => async (req, res, next) => {
        try {
            const token = req.get(constant.AUTHORIZATION);

            if (!token) {
                return next(new ApiError('No token', statusCodes.UNAUTHORIZED));
            }
            tokenService.checkToken(token, tokenType);

            const tokenInfo = await ActionTokenService.getOneByParamsWithUser({tokenType, token});

            if (!tokenInfo) {
                return next(new ApiError('Not valid token', statusCodes.UNAUTHORIZED))
            }
            req.tokenInfo = tokenInfo;


            next();
        } catch (e) {
            next(e)
        }
    },

    checkPreviousPassword: async (req, res, next) => {
        try {

            const {user} = req.tokenInfo;
            const {password} = req.body;

            const oldPasswords = await previousPasswordService.getByUserId(user._id);

            const promises = await Promise.allSettled([
                ...oldPasswords.map(old => tokenService.comparePasswords(password, old.password)),
                tokenService.comparePasswords(password, user.password)
            ]);

            for (const {status} of promises) {
                if (status === 'fulfilled') {
                    return next(new ApiError('You can\'t use your old password', statusCodes.BAD_REQUEST));
                }
            }

            next();
        } catch (e) {
            next(e)
        }
    },

    checkIsRefreshToken: async (req, res, next) => {
        try {

            const refresh_token = req.get(constant.AUTHORIZATION);
            if (!refresh_token) {
                return next(new ApiError('No token', statusCodes.UNAUTHORIZED));
            }

            tokenService.checkToken(refresh_token, tokenTypeEnum.REFRESH);

            const tokenInfo = await authService.getOneParams({refresh_token});

            if (!tokenInfo) {
                return next(new ApiError('Not valid token', statusCodes.UNAUTHORIZED))
            }

            req.tokenInfo = tokenInfo;

            next();
        } catch (e) {
            next(e)
        }
    },
}



