import Joi from 'joi';
import { max } from 'lodash';

//Here is where we validate, you can chek Joi for more info about how it works.

let message =  {
                'string.empty': `empty`,
                'any.required': `required`, 
                'string.email':'invalid_mail', 
                'string.min': 'input_invalid_length', 
                'string.max':'input_too_long',
              }

export const signUpValidation = Joi.object({
  email: Joi.string().email().lowercase().required().messages(message),
  password: Joi.string().min(6).required().messages(message),
  firstname: Joi.string().required().messages(message),
  lastname: Joi.string().required().messages(message),
  status: Joi.string().required().messages(message),
});


export const businessValidation = Joi.object({
  businessName: Joi.string().required().messages(message),
  businessShort: Joi.string().required().messages(message),
  businessDescription: Joi.string().required().messages(message),
  user: Joi.any().required().messages(message),
});
export const businessUpdateValidation = Joi.object({
  businessName: Joi.string().required().messages(message),
  businessShort: Joi.string().required().messages(message),
  businessDescription: Joi.string().required().messages(message),
  businessEmail : Joi.any().required().messages(message),
  businessNumber: Joi.any().required().messages(message),
  businessCountry : Joi.any().required().messages(message),
  businessAdress : Joi.any().required().messages(message),
  user: Joi.any().required().messages(message)
})


export const paymentPageValidation = Joi.object({
  paymentType : Joi.string().required().messages(message),
  paymentLabel : Joi.string().required().messages(message),
  paymentDescription : Joi.string().required().messages(message),
  amount : Joi.number().required().messages(message),
  currency : Joi.string().required().messages(message),
  paymentLinkTag : Joi.string().required().messages(message),
  user: Joi.any().required().messages(message),
  business: Joi.any().required().messages(message)
})

export const updatePaymentPageValidation = Joi.object({
  paymentType : Joi.string().required().messages(message),
  paymentLabel : Joi.string().required().messages(message),
  paymentDescription : Joi.string().required().messages(message),
  amount : Joi.number().required().messages(message),
  currency : Joi.string().required().messages(message),
  paymentLinkTag : Joi.string().required().messages(message),
  user: Joi.any().required().messages(message),
  business: Joi.any().required().messages(message),
  paymentPage: Joi.any().required().messages(message)
})


export const transactionValidation = Joi.object({

  paymentType : Joi.string().required().messages(message),
  paymentLabel : Joi.string().required().messages(message),
  paymentDescription : Joi.string().required().messages(message),
  amount : Joi.number().required().messages(message),
  currency : Joi.string().required().messages(message),
  customer:Joi.any().required().messages(message),
  rate: Joi.string().required().messages(message),
  payment: Joi.any().required().messages(message),
  paymentCurrency: Joi.string().required().messages(message),
  charge: Joi.any().required().messages(message),
  balance: Joi.any().required().messages(message),
  paymentMethod: Joi.string().required().messages(message),
  status: Joi.string().required().messages(message),
  paymentLinkTag : Joi.string().required().messages(message),
  //paymentChannelId : Joi.number().required().messages(message),
  paymentAddress : Joi.string().required().messages(message),
  user: Joi.any().required().messages(message),
  paymentPage: Joi.any().required().messages(message)
})



export const userUpdateValidation  = Joi.object({
  firstname: Joi.string().required().messages(message),
  lastname: Joi.string().required().messages(message),

});
export const loginValidation = Joi.object({
  email: Joi.string().email().lowercase().required().messages(message),
  password: Joi.string().min(6).required().messages(message),
});

export const profileImageValidation = Joi.object({ profileImage: Joi.string().required().messages(message),});
export const passwordValidation = Joi.object({ password: Joi.string().min(6).required().messages(message), });
export const oldPasswordValidation = Joi.object({ oldPassword: Joi.string().min(6).required().messages(message), });
export const newPasswordValidation = Joi.object({ newPassword: Joi.string().min(6).required().messages(message),});
export const shortsReactionValidation = Joi.object({ 
  reaction: Joi.string().required() .messages(message),  
});

export const packValidation = Joi.object({
  title: Joi.string().required().messages(message),
  description: Joi.string().max(300).required().messages(message),
  categories: Joi.any().required().messages(message),
  initiative: Joi.string().required().messages(message),
  readTime: Joi.number().required().messages(message),
  pages: Joi.any().required().messages(message),
  titleImage: Joi.string().required().messages(message),
});


export const inputValidation = Joi.object({input:Joi.string().required().messages(message) });
export const inputIntValidation = Joi.object({inputInt:Joi.string().required().messages(message) });
export const titleValidation = Joi.object({ title: Joi.string().required().messages(message) });
export const contentValidation = Joi.object({ content: Joi.string().max(300).required().messages(message) });
export const imageValidation = Joi.object({ image: Joi.string().required().messages(message) });
export const descriptionValidation = Joi.object({ description: Joi.string().required().messages(message) });
export const textValidation = Joi.object({ text: Joi.string().required().messages(message) });