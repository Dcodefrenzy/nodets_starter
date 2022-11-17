import {createPaymentPage, getPaymentPages,
     getPaymentPage, searchPaymentTag,
      updatePaymentPage, 
      findPaymentPageById} from "./payment_controller";
import { authentication } from "../helper/authentication";

import express from "express";
import { findBusinessById, getBusiness } from "../business/business_controller";
const paymentRoute = express.Router();



paymentRoute.route('/:businessId/create').post(authentication, findBusinessById, createPaymentPage)
paymentRoute.route("/:businessId").get(authentication, findBusinessById, getPaymentPages)
paymentRoute.route("/:businessId/:id").get(authentication, findBusinessById, getPaymentPage)
paymentRoute.route("/:businessId/tag/:paymentTag").get(authentication, findBusinessById, searchPaymentTag)
paymentRoute.route("/:businessId/update/:paymentId").put(authentication, findBusinessById, findPaymentPageById, updatePaymentPage)







export default paymentRoute;
