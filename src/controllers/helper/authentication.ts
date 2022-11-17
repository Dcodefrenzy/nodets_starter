import {Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import  prisma  from '../../db/db';
import { logger } from "../../logger/logger";
import jwt from 'jsonwebtoken';
import { signUpValidation, loginValidation, passwordValidation } from '../helper/validation';
import {    postRequestError, updateRequestError, 
            getParamRequestError, deleteRequestError, 
            errorNotFound, duplicateRequestError, 
            incorrectRequestError } from "../../errors/app_errors";


export const authentication = async (req:Request, res:Response, next:NextFunction) =>{
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
        logger.error("Something went wrong at Token Bearer Validation")
        return res.status(401).send({status:401, message:"unauthorised access"});
    }
    let token;
    const postManToken = bearerHeader.split(' ')[1];
    if (postManToken == undefined) {
        token = bearerHeader;
    }else{
        token = postManToken;
    }

    //const token = bearerHeader;
    //Verified if our token is legit.
    jwt.verify(
        token,
        process.env.JWT_SECRET,
        async(err, data:any) => {
            if (err) {
                return res.status(401).send({status:401, message:"unauthorised access", err:err});
                logger.error(err);
                logger.error("Something went wrong at JWT Token Validation");
            }else{                
                try {  
                    logger.info(data)   
                    const validatedData = await loginValidation.validateAsync({email:data.email, password:data.password});
                    const user = await prisma.user.findUnique({
                        where: {
                          email: validatedData.email,
                        },
                    });
                    if (user) {
                        req.body.user = user;
                        next();
                          //still need to check for valid password.
                    }else {
                        const e = incorrectRequestError({label:"Token"});
                        res.status(e.errorCode).send({error:e});
                        return;                    
                    }
                    
                } catch (error) {
                    logger.error(error)
                    logger.error("Something went wrong at Token Validation CATCH error")
                    res.status(500).send("Something went wrong."); 
                }
            }            
        }
    )
}
