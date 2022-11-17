import { NextFunction, Request, Response } from 'express';
import { Status } from "@prisma/client";
import  prisma  from '../../db/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { logger } from '../../logger/logger';
import { 
    signUpValidation, 
    loginValidation, 
    passwordValidation, 
    newPasswordValidation, 
    userUpdateValidation, 
    oldPasswordValidation, 
    profileImageValidation } from '../helper/validation';

import  { postRequestError, 
    updateRequestError, 
    getParamRequestError, 
    deleteRequestError, 
    errorNotFound, 
    duplicateRequestError, 
    incorrectRequestError } from '../../errors/app_errors';


//Create a User
export const createUser = async (req:Request, res:Response)=>{
    try {
        const userBody = await signUpValidation.validateAsync(req.body); 
        const hashedPassword = await bcrypt.hash(userBody.password, 10);

        const user = await prisma.user.create({
            data: {
                email: userBody.email,
                password: hashedPassword,
                firstname: userBody.firstname,
                lastname: userBody.lastname,
                status: userBody.status,
            }
        })
        
        res.status(201).json(_.omit(user, 'password', 'id', 'lastUpdated', 'creationDate'));
        return;
    } catch (error:any) {
        logger.error(error.message); 
        logger.error(error); 
        
        if (error.isJoi === true) {
            let  e = postRequestError(error); 
            res.status(e.errorCode).json(e);  
            return; 
        }
        res.status(500).json("Duplicate/ User already Exist.");
        return;  
    }
}

//Get all users
export const getUsers =async (req:Request, res:Response) => {

    const users = await prisma.user.findMany({});
    res.status(200).send(users);
}


//Get all user
export const getUser =async (req:Request, res:Response) => {
    const id : number = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
        where: {
            id:id
        }
    });
    if (!user) {
     const e = errorNotFound({label:"User"});
     res.status(e.errorCode).json(e);
     return;   
    }
    res.status(200).json(_.omit(user, 'password'));
    return;
}

//Log a User In
export const userLogin =async (req:Request, res:Response) => {
  try {
    const userData = await loginValidation.validateAsync(req.body);
    const user = await prisma.user.findUnique({
            where: {
            email: userData.email,
            },
      });
      if (!user) {
        const e = errorNotFound({label:"User"});
        res.status(e.errorCode).json(e);
        return; 
      }else {
        const passwordValid = await bcrypt.compare(userData.password, user.password);
        if (passwordValid) {
            jwt.sign(
                {email:user.email, password:user.password},
                process.env.JWT_SECRET, 
                {expiresIn: '1h'}, 
                (err, token) =>{
                    if (err) {
                        logger.info(err);
                        const e = postRequestError({label:"email/password", message:err});
                        res.status(e.errorCode).send({error:e});
                        return;
                    }
                    res.status(200).json({token:token, id:user.id});
                    return;
                }
            )
        }else if (!passwordValid) {
            const e = incorrectRequestError({label:"email/password"});
            res.status(e.errorCode).send({error:e});
            return;
        }
    }
  } catch (error:any) {
    logger.error(error);
        if (error.isJoi === true) {
            logger.error(error);
            let  e = postRequestError(error.details[0]); 
          res.status(e.errorCode).send({  error:e });
          return;
        }
        res.status(500).send("something went wrong here."); 
  }

}



