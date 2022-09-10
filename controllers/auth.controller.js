const {
    authService,
    tokenService,
    emailService,
    ActionTokenService,
    userService,
    previousPasswordService
} = require("../services");
const {statusCodes: {NO_CONTENT}, emailActionEnum, constant} = require("../constants/");
const {tokenTypeEnum} = require("../constants");
const {FRONTEND_URL} = require("../configs/config");


module.exports = {
    login: async (req, res, next) => {
        try {
            const {password, email} = req.body;
            const {password: hashPassword, _id, name} = req.user;

            await tokenService.comparePasswords(password, hashPassword)

            const authTokens = tokenService.createAuthTokens({_id});

            await authService.saveTokens({...authTokens, user: _id})

            await emailService.sendEmail(email, emailActionEnum.WELCOME, {userName: name});
            // await sendEmail(email, emailActionEnum.FORGOT_PASSWORD);

            res.json({
                ...authTokens,
                user: req.user
            });

        } catch (e) {
            next(e)
        }
    },

    logout: async (req, res, next) => {
        try {
            const {user, access_token} = req.tokenInfo;

            await authService.deleteOneByParams({user: user._id, access_token});

            res.sendStatus(NO_CONTENT);

        } catch (e) {
            next(e)
        }
    },

    refresh: async (req, res, next) => {
        try {
            const {user, refresh_token} = req.tokenInfo;

            await authService.deleteOneByParams({refresh_token})

            const authTokens = tokenService.createAuthTokens({_id: user});

            const newTokens = await authService.saveTokens({...authTokens, user})

            res.json({newTokens});

        } catch (e) {
            next(e)
        }
    },

    forgotPassword: async (req, res, next) => {
        try {

            const {email, _id} = req.user;

            const actionToken = tokenService.createActionToken(tokenTypeEnum.FORGOT_PASSWORD, {_id});

            const url = `${FRONTEND_URL}/password/forgot-pass-page?token=${actionToken}`;
            await emailService.sendEmail(email, emailActionEnum.FORGOT_PASSWORD, {url});

            await ActionTokenService.createActionToken({
                tokenType: tokenTypeEnum.FORGOT_PASSWORD,
                user: _id,
                token: actionToken,
            })

            res.json('OK');


        } catch (e) {
            next(e);
        }

    },

    setNewForgotPassword: async (req, res, next) => {
        try {
            const {user} = req.tokenInfo;
            const {password} = req.body;
            const token = req.get(constant.AUTHORIZATION)

            await previousPasswordService.savePasswordInfo({password: user.password, user: user._id});

            await authService.deleteMany({user: user._id});

            await ActionTokenService.deleteOne({token});

            const hashPassword = await tokenService.hashPassword(password);
            await userService.updateUserById(user._id, {password: hashPassword});

            res.json('OK')

        } catch (e) {
            next(e);
        }

    },
}