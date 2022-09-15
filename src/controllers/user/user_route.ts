import { createUser, getUser, getUsers, userLogin} from "./user_controller";
//import { authentication, adminAuthentication } from "../helper/authentication";

import express from "express";
const userRouter = express.Router();

//userRouter.route("/authentication").get(authentication, verification);


userRouter.route('/create').post(createUser)
userRouter.route('/').get(getUsers)
userRouter.route('/:id').get(getUser)
userRouter.route('/login').post(userLogin)





export default userRouter;
