const {Router} = require("express")

const userController = require("../controllers/User.controller");

const userRouter = Router();
userRouter.get('/', userController.getAllUsers);
userRouter.post('/', userController.createUser);

userRouter.get('/:userId', userController.getUserById);
userRouter.put('/:userId', userController.updateUserById);
userRouter.delete('/:userId', userController.deleteUserById);


module.exports = userRouter;

