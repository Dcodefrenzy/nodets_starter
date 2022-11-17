import express from "express";
import userRouter from './controllers/user/user_route';
import businessRouter from './controllers/business/business_route';
import paymentRoute from "./controllers/payment/payment_router";
import walletRoute from "./controllers/wallet/wallet_router";
import transactionRoute from "./controllers/transaction/transaction_route";


const api = express.Router();

api.use("/users", userRouter);
api.use("/business", businessRouter);
api.use("/payments", paymentRoute);
api.use("/wallets", walletRoute);
api.use("/transactions", transactionRoute);


export default api;