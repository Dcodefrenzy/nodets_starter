import { NextFunction, Request, Response } from 'express';
import  prisma  from '../../db/db';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { logger } from '../../logger/logger';
import { duplicateRequestError, errorNotFound, postRequestError } from '../../errors/app_errors';
import { businessUpdateValidation, businessValidation, paymentPageValidation, updatePaymentPageValidation } from '../helper/validation';
import { Currency } from '@prisma/client';
import walletRoute from './wallet_router';


export const createWalletsForBusiness =async (req:Request, res:Response) => {
    try {
        logger.info("BUSINESS ID")
        logger.info(req.body.business.id);
        const businessWallets = await prisma.wallet.createMany({
            data: [
                { balance: 0.00, currency: "NGN",businessId:req.body.business.id},
                { balance: 0.00, currency: "USD",businessId:req.body.business.id},
                { balance: 0.00, currency: "USDT",businessId:req.body.business.id},
            ]
        });
        logger.info("WALLETS")
        logger.info(businessWallets);
        res.status(201).json({business:req.body.business, wallets:businessWallets}); 
    } catch (error:any) {
        logger.error(error.message); 
        logger.error(error); 
        
        if (error.isJoi === true) {
            let  e = postRequestError(error); 
            res.status(e.errorCode).json(e);  
            return; 
        }
        res.status(500).json("Can't create a wallets.");
        return;
    }   
}

export const createWallet =async (req:Request, res:Response) => {
    try {
        logger.info("BUSINESS ID")
        logger.info(req.body.business.id);
        const businessWallet = await prisma.wallet.create({
            data: {
                
                    balance: 0.00, 
                    currency: req.body.currency, 
                    businessId:req.body.business.id,
            }
        });
        logger.info("WALLETS")
        logger.info(businessWallet);
        res.status(201).json({business:req.body.business, wallet:businessWallet}); 
    } catch (error:any) {
        logger.error(error.message); 
        logger.error(error); 
        
        if (error.isJoi === true) {
            let  e = postRequestError(error); 
            res.status(e.errorCode).json(e);  
            return; 
        }
        res.status(500).json("Can't create a wallets.");
        return;
    }   
}

export const getWallets =async (req:Request, res:Response) => {
    try {
        const wallets = await prisma.wallet.findMany({
            where: {
                businessId: req.body.business.id
            }
        });
        logger.info("WALLETS JSOn")
        logger.info(wallets)
        res.status(200).json(wallets);
        return;
        
    } catch (error:any) {
        logger.error(error);
        res.status(500).json("Can't get Wallets.");
        return;
    }
}

export const findWalletByCurrency = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const currency :Currency = req.params.currency as Currency
        const wallet = await prisma.wallet.findFirst({
            where: {
                currency:currency,
                businessId: req.body.business.id 
            }
        });

        if (!wallet) {     
            const e = errorNotFound({label:"User"});
            res.status(e.errorCode).json(e);
            return;     
        }
        next()
        req.body.wallet = wallet;
        return;
        
    } catch (error:any) {   
        logger.error(error);         
        const e = errorNotFound({label:"User"});
        res.status(e.errorCode).json(e);
        return;     


    }
}


export const getWalletByCurrency =async (req:Request, res:Response) => {
    try {
        const currency :Currency = req.params.currency as Currency
        const wallet = await prisma.wallet.findFirst({
            where: {
                currency:currency,
                businessId: req.body.business.id 
            }
        });

        if (!wallet) {     
            const e = errorNotFound({label:"User"});
            res.status(e.errorCode).json(e);
            return;     
        }
        res.status(200).json(wallet);
        return;
        
    } catch (error:any) {   
        logger.error(error);         
        const e = errorNotFound({label:"User"});
        res.status(e.errorCode).json(e);
        return;     


    }
}


export const updateWalletTransactionBalance =async (req:Request, res:Response) => {
    try {
        const currency :Currency = req.body.transaction.currency as Currency
        const wallet = await prisma.wallet.findFirst({
            where: {
                currency:currency,
                businessId: req.body.transaction.businessId 
            }
        });

        logger.info("---------------========Start Wallet========----")
        logger.info("---------------========================--------")
        logger.info(JSON.stringify(wallet))
        logger.info("---------------========================--------")
        logger.info("---------------========================--------")
        if (!wallet) {     
            const e = errorNotFound({label:"Wallet"});
            res.status(e.errorCode).json(e);
            return;     
        }
        const walletData = {balance:wallet.balance + req.body.transaction.balance, id:wallet.id}
        updateWallet(req, res, walletData)
        
    } catch (error:any) {
        
        logger.info("---------------========Start Wallet ERROR========----")
        logger.info("---------------========================--------")
        logger.info(JSON.stringify(error))
        logger.info("---------------========================--------")
        logger.info("---------------========================--------")
      
        logger.error(error);         
        const e = errorNotFound({label:"User"});
        res.status(e.errorCode).json(e);
        return;     


    }
}

const updateWallet =async (req:Request, res:Response, wallet:any) => {
    const updatedWallet = await prisma.wallet.update({
        where: {id:wallet.id},
        data:{
            balance: wallet.balance,
            transactions : {
                connect: [{"id":req.body.transaction.id}]
            }

        }
    });
    logger.info("---------------========Start Wallet Update========----")
    logger.info("---------------========================--------")
    logger.info(JSON.stringify(updatedWallet))
    logger.info("---------------========================--------")
    logger.info("---------------=======END=================--------")
    
    if (!updatedWallet) {
        const e = errorNotFound({label:"Wallet"});
        res.status(e.errorCode).json(e);
        return;    
    }
    res.status(201).json({transaction:req.body.transaction, wallet:updatedWallet});
} 