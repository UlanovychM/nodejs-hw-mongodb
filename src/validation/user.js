import Joi from 'joi';

export const registerShema = Joi.object({
  name: Joi.string().required().messages({
    base: 'Name should be a string',
    'any.required': 'Name is required',
  }),
  email: Joi.string().required().messages({
    base: 'Email should be a string',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    base: 'Password should be a string',
    'any.required': 'Password is required',
  }),
});

export const loginShema = Joi.object({
  email: Joi.string().required().messages({
    base: 'Email should be a string',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    base: 'Password should be a string',
    'any.required': 'Password is required',
  }),
});
