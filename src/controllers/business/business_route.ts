import { createBusiness, getBusiness, getBusinesses, updateBusiness } from "./business_controller";
import { authentication } from "../helper/authentication";

import express from "express";
import { createWalletsForBusiness } from "../wallet/wallet_controller";
const businessRouter = express.Router();

//userRouter.route("/authentication").get(authentication, verification);


businessRouter.route('/create').post(authentication, createBusiness, createWalletsForBusiness)
businessRouter.route("/").get(authentication, getBusinesses)
businessRouter.route("/:id").get(authentication, getBusiness)
businessRouter.route("/update/:id").put(authentication, updateBusiness)







export default businessRouter;
