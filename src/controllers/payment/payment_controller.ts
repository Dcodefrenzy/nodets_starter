import { NextFunction, Request, Response } from 'express';
import  prisma  from '../../db/db';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { logger } from '../../logger/logger';
import { duplicateRequestError, errorNotFound, postRequestError } from '../../errors/app_errors';
import { businessUpdateValidation, businessValidation, paymentPageValidation, updatePaymentPageValidation } from '../helper/validation';


export const createPaymentPage = async (req:Request, res:Response) => {
    try {
        const paymentData = await paymentPageValidation.validateAsync(req.body);
        logger.info(paymentData)
        logger.info("Payment data")
        const paymentPage = await prisma.paymentPage.create({
            data: {
                paymentType : paymentData.paymentType,
                paymentLabel : paymentData.paymentLabel,
                paymentDescription : paymentData.paymentDescription,
                amount : paymentData.amount,
                currency : paymentData.currency,
                paymentLinkTag : paymentData.business.businessShort+"-"+paymentData.paymentLinkTag,
                businessId: parseInt(paymentData.business.id)
            }
        });
        logger.info(paymentPage)
        logger.info("Payment page")
        res.status(201).json(paymentPage);
    } catch (error:any) {  
        logger.info(`============PAYMENT PAGE ERROR=====================`);
        logger.info(`======= ERROR: ${error}=======`);
        logger.info(`ERROR MESSAGE ${error.message}`);
        logger.info(`============END PAYMENT PAGE ERROR===================`);
   
        
        if (error.isJoi === true) {
            let  e = postRequestError(error); 
            res.status(e.errorCode).json(e);  
            return; 
        }
        res.status(500).json("Can't create a business.");
        return;
    }        
}

export const getPaymentPages =async (req:Request, res:Response) => {
    try {
        const paymentPages = await prisma.paymentPage.findMany({
            where: {
                businessId: req.body.business.id
            }
        });
        res.status(200).json(paymentPages);
        return;

    } catch (error:any) {
        logger.info(`============PAYMENT |GET ALL| PAGE ERROR=====================`);
        logger.info(`======= ERROR: ${error}=======`);
        logger.info(`ERROR MESSAGE ${error.message}`);
        logger.info(`============END PAYMENT PAGE ERROR===================`);
        res.status(500).json("Can't find a business.");
        return;
    }
}
export const getPaymentPage =async (req:Request, res:Response) => {
    try {
        logger.info(`HERE PARAMS+++++++++++++++++${req.params.id}++++++++++++++`)
        const paymentPage = await prisma.paymentPage.findFirst({
            where: {
                uuid:req.params.id,
                businessId: req.body.business.id
            }
        });
        if (!paymentPage) {
        const e = errorNotFound({label:"Payment-page"});
        res.status(e.errorCode).json(e);
        return; 
        }
        res.status(200).json(paymentPage);
        return;

    } catch (error:any) {
        logger.info(`============PAYMENT |GET ALL| PAGE ERROR=====================`);
        logger.info(`======= ERROR: ${error}=======`);
        logger.info(`ERROR MESSAGE ${error.message}`);
        logger.info(`============END PAYMENT PAGE ERROR===================`);
        res.status(500).json("Can't find a business.");
        return;
    }
}
export const searchPaymentTag =async (req:Request, res:Response) => {
    try {

        const paymentPage = await prisma.paymentPage.findFirst({
            where: {
                paymentLinkTag:req.body.business.businessShort +"-"+req.params.paymentTag,
                businessId: req.body.business.id

            }
        });
        if (paymentPage) {
        const e = duplicateRequestError({label:"Tag-Name"});
        res.status(e.errorCode).json(e);
        return; 
        }
        res.status(200).json({tagStatus:"Not Found"});
        return;

    } catch (error:any) {
        logger.info(`============PAYMENT |GET ALL| PAGE ERROR=====================`);
        logger.info(`======= ERROR: ${error}=======`);
        logger.info(`ERROR MESSAGE ${error.message}`);
        logger.info(`============END PAYMENT PAGE ERROR===================`);
        res.status(500).json("Can't find a business.");
        return;
    }
}
export const findPaymentPageById = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const paymentPage = await prisma.paymentPage.findFirst({
            where: {
                uuid:req.params.paymentId,
            }
        });
        if (!paymentPage) {
        const e = errorNotFound({label:"Payment-page"});
         res.status(e.errorCode).json(e);
        }
        req.body.paymentPage = paymentPage;
        next();

    } catch (error:any) {
        logger.info(`============PAYMENT |GET BY ID| PAGE ERROR=====================`);
        logger.info(`======= ERROR: ${error}=======`);
        logger.info(`ERROR MESSAGE ${error.message}`);
        logger.info(`============END PAYMENT PAGE ERROR===================`);
         res.status(500).json("Can't find a business.");
        
    }
}

export const updatePaymentPage =async (req:Request, res:Response) => {
    try {
        const paymentData = await updatePaymentPageValidation.validateAsync(req.body);
        logger.info(paymentData)
        logger.info("Payment data")
        const paymentPage = await prisma.paymentPage.update({
            where: {
                id:req.body.paymentPage.id
            },
            data: {
                paymentType : paymentData.paymentType,
                paymentLabel : paymentData.paymentLabel,
                paymentDescription : paymentData.paymentDescription,
                amount : paymentData.amount,
                currency : paymentData.currency,
                paymentLinkTag : paymentData.business.businessShort+"-"+paymentData.paymentLinkTag,
            }
        });
        logger.info(paymentPage)
        logger.info("Payment page")
        res.status(201).json(paymentPage);
    } catch (error:any) {  
        logger.info(`============PAYMENT PAGE UPDATE ERROR=====================`);
        logger.info(`======= ERROR: ${error}=======`);
        logger.info(`ERROR MESSAGE ${error.message}`);
        logger.info(`============END PAYMENT PAGE ERROR===================`);
   
        
        if (error.isJoi === true) {
            let  e = postRequestError(error); 
            res.status(e.errorCode).json(e);  
            return; 
        }
        res.status(500).json("Can't create a business.");
        return;
    }        
}