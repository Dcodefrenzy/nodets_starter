import express from "express";
import { createWallet, findWalletByCurrency, getWalletByCurrency, getWallets, updateWalletTransactionBalance } from "../wallet/wallet_controller";
import { findBusinessById, getBusiness } from "../business/business_controller";
import { authentication } from "../helper/authentication";
import { createTransaction, getBusinessTransactions, getPaymentTransactions, getTransactionsById } from "./transaction_controller";
import { findPaymentPageById } from "../payment/payment_controller";
const transactionRoute = express.Router();



transactionRoute.route('/:paymentId/create').post(authentication, findPaymentPageById, createTransaction, updateWalletTransactionBalance)
transactionRoute.route('/:paymentId/update/:transactionID').put(authentication, findPaymentPageById, createTransaction, updateWalletTransactionBalance)
transactionRoute.route("/business/:businessId").get(authentication, findBusinessById, getBusinessTransactions)
transactionRoute.route("/payment/:paymentId").get(authentication, findPaymentPageById, getPaymentTransactions)
transactionRoute.route("/:id").get(authentication, getTransactionsById)







export default transactionRoute;
