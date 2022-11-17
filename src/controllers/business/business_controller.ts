import { NextFunction, Request, Response } from 'express';
import  prisma  from '../../db/db';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { logger } from '../../logger/logger';
import { duplicateRequestError, errorNotFound, postRequestError } from '../../errors/app_errors';
import { businessUpdateValidation, businessValidation } from '../helper/validation';



export const createBusiness = async (req:Request, res:Response, next:NextFunction) => {
    try {
       const businessData = await businessValidation.validateAsync(req.body);
        const userBusiness = await prisma.business.create({
            data: {
                businessName : businessData.businessName,
                businessShort: businessData.businessShort,
                businessDescription: businessData.businessDescription,
                ownerId: req.body.user.id 
            }
        });
        logger.info(userBusiness);
        req.body.business = userBusiness;
        next();
    } catch (error:any) {
        logger.error(error.message); 
        logger.error(error); 
        
        if (error.isJoi === true) {
            let  e = postRequestError(error); 
            res.status(e.errorCode).json(e);  
            return; 
        }
        res.status(500).json("Can't create a business.");
        return;
    }
}

export const getBusinesses = async (req:Request, res:Response) => {
    try {
        const businesses = await prisma.business.findMany({
            where: {
                ownerId: req.body.user.id
            }
        });
        res.status(200).json(businesses);
        return;

    } catch (error:any) {
        res.status(500).json("Can't create a business.");
        return;
        logger.error(error);
    }
}

export const getBusiness = async (req:Request, res:Response) => {
        try {
        const business = await prisma.business.findFirst({
            where: {
                id:parseInt(req.params.id),
                ownerId: req.body.user.id
            }
        });
        if (!business) {     
            const e = errorNotFound({label:"User"});
            res.status(e.errorCode).json(e);
            return;     
        }
        res.status(200).json(business);
        return;
        
    } catch (error:any) {
        res.status(500).json("Can't create a business.");
        return;
        logger.error(error);
    }
}


export const findBusinessById = async (req:Request, res:Response, next:NextFunction) => {
    try {
    const business = await prisma.business.findFirst({
        where: {
            uuid:req.params.businessId,
            ownerId: req.body.user.id
        }
    });
    if (!business) {     
        const e = errorNotFound({label:"Business"});
        res.status(e.errorCode).json(e);
        return;     
    }
    req.body.business = business;
    next();
    return;
    
} catch (error:any) {
    res.status(500).json("Can't create a business.");
    return;
    logger.error(error);
}
}

export const updateBusiness = async(req:Request, res:Response)=> {
    try {
        const businessData = await businessUpdateValidation.validateAsync(req.body);
        
        const updatedBusiness = await prisma.business.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                businessName : businessData.businessName,
                businessShort: businessData.businessShort,
                businessDescription: businessData.businessDescription,
                businessEmail: businessData.businessEmail,
                businessNumber: businessData.businessNumber,
                businessCountry : businessData.businessCountry,
                businessAdress : businessData.businessAdress      
            }
        })
        logger.info(updatedBusiness.businessNumber)
        res.status(201).json(updatedBusiness);
        return;

    } catch (error:any) {
        logger.error(error.message); 
        logger.error(error); 
        
        if (error.isJoi === true) {
            let  e = postRequestError(error); 
            res.status(e.errorCode).json(e);  
            return; 
        }
        let e = duplicateRequestError({label:"Business"})
        res.status(e.errorCode).json(e);
        return;
    }
}