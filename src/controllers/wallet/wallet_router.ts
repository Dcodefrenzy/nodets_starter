import express from "express";
import { createWallet, findWalletByCurrency, getWalletByCurrency, getWallets } from "./wallet_controller";
import { findBusinessById, getBusiness } from "../business/business_controller";
import { authentication } from "../helper/authentication";
const walletRoute = express.Router();



walletRoute.route('/:businessId/create').post(authentication, findBusinessById, findWalletByCurrency, createWallet)
walletRoute.route("/:businessId").get(authentication, findBusinessById, getWallets)
walletRoute.route("/:businessId/:currency").get(authentication, findBusinessById,getWalletByCurrency )







export default walletRoute;
