const {statusCodes} = require('../constants')
const {ApiError} = require('../errors/apiError')
const User = require('../dataBase/User')
const {userService} = require("../services");

module.exports = {
    getAllUsers: async (req, res, next) => {
        try {
            const usersFromService = await User.find();
            res.json(usersFromService);
        } catch (e) {
            next(e)
        }
    },

    createUser: async (req, res, next) => {
        try {
            await userService.createUser(req.body);

            res.status(statusCodes.CREATE).json(user);
        } catch (e) {
            next(e)
        }
    },

    getUserById: async (req, res, next) => {
        try {
            const {userId} = req.params;

            const user = await User.findById(userId);

            if (!user) {
                throw new ApiError('User not found', statusCodes.NOT_FOUND)
            }
            res.json(user);
        } catch (e) {
            next(e)
        }

    },

    updateUserById: async (req, res, next) => {
        try {
            const {userId} = req.params;

            const user = await userService.updateUserById(userId, req.body);

            res.json(user);
        } catch (e) {
            next(e)
        }
    },

    deleteUserById: async (req, res, next) => {
        try {
            const {userId} = req.params;

            await userService.deleteUserById(userId);


            res.sendStatus(statusCodes.NO_CONTENT);
        } catch (e) {
            next(e)
        }
    }
}