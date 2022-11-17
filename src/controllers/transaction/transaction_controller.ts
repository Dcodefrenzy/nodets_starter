import { NextFunction, Request, Response } from 'express';
import  prisma  from '../../db/db';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { logger } from '../../logger/logger';
import { duplicateRequestError, errorNotFound, postRequestError } from '../../errors/app_errors';
import { transactionValidation } from '../helper/validation';



export const createTransaction =async (req:Request, res:Response, next:NextFunction) => {
    try {
       const transactionData = await transactionValidation.validateAsync(req.body);
        const transaction = await prisma.transaction.create({
            data: {
                paymentType: transactionData.paymentType,
                paymentLabel:transactionData.paymentLabel,
                paymentDescription: transactionData.paymentDescription,
                amount: transactionData.amount,
                currency: transactionData.currency,
                customer: transactionData.customer,
                payment : transactionData.payment,
                paymentCurrency: transactionData.paymentCurrency,
                rate : transactionData.rate,
                charge : transactionData.charge,
                balance : transactionData.balance,
                status: transactionData.status,
                paymentAddress: transactionData.paymentAddress,
                paymentLinkTag :transactionData.paymentLinkTag,
                paymentPageId : transactionData.paymentPage.id,
                businessId: transactionData.paymentPage.businessId
            }
        })
        if (!transaction) {
            logger.error(JSON.stringify(transaction))
            let  e = postRequestError({label:"Transaction"}); 
            return res.status(e.errorCode).json(e);   
        }
        req.body.transaction = transaction;
        next();
    } catch (error:any) {
        logger.error("==================Transaction Creeate Error=============");
        logger.error(error.message); 
        logger.error(JSON.stringify(req.body)); 
        logger.error("==================Transaction Creeate Error=============");

        if (error.isJoi === true) {
            let  e = postRequestError(error); 
            return res.status(e.errorCode).json(e);   
        }else{
            res.status(500).json("Can't create a Transaction.");
            return;
        }
    }  
}
export const getBusinessTransactions =async (req:Request, res:Response) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                businessId: req.body.business.id
            }
        });
        logger.info("Transactions JSOn")
        logger.info(JSON.stringify(transactions))
        res.status(200).json(transactions);
        return;
        
    } catch (error:any) {
        logger.error(JSON.stringify(error));
        res.status(500).json("Can't get Transactions.");
        return;
    }
}

export const getPaymentTransactions =async (req:Request, res:Response) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                paymentPageId: req.body.paymentPage.id
            }
        });
        logger.info("Transactions JSOn")
        logger.info(JSON.stringify(transactions))
        res.status(200).json(transactions);
        return;
        
    } catch (error:any) {
        logger.error(JSON.stringify(error));
        res.status(500).json("Can't get Transactions.");
        return;
    }
}

export const getTransactionsById =async (req:Request, res:Response) => {
    try {
        const transaction = await prisma.transaction.findFirst({
            where: {
                uuid: req.params.id
            }
        });
        if (!transaction) {    
            const e = errorNotFound({label:"Transaction"});
            res.status(e.errorCode).json(e);
            return;  
        }
        logger.info("Transaction Json")
        logger.info(JSON.stringify(transaction))
        res.status(200).json(transaction);
        return;
        
    } catch (error:any) {
        logger.error(JSON.stringify(error));
        res.status(500).json("Can't get Transactions.");
        return;
    }
}
