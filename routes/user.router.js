const {Router} = require("express")

const userController = require("../controllers/User.controller");
const {userMdlwr, commonMdlwr, authMdlwr} = require("../middlewares");

const userRouter = Router();
userRouter.get('/', userController.getAllUsers);
userRouter.post(
    '/',
    userMdlwr.checkIsUserBodyValid,
    userMdlwr.checkIsUserEmailUniq,
    userController.createUser
);

userRouter.get(
    '/:userId',
    commonMdlwr.checkIsIdValid('userId'),
    userMdlwr.isUserPresent,
    userController.getUserById);

userRouter.put(
    '/:userId',
    commonMdlwr.checkIsIdValid('userId'),
    authMdlwr.checkIsAccessToken,
    userMdlwr.isUserPresent,
    userMdlwr.checkIsUserEmailUniq,
    userController.updateUserById);

userRouter.delete(
    '/:userId',
    commonMdlwr.checkIsIdValid('userId'),
    authMdlwr.checkIsAccessToken,
    userMdlwr.isUserPresent,
    userController.deleteUserById);


module.exports = userRouter;

