import express from 'express';
import Joi from '@hapi/joi';
import { createValidator } from 'express-joi-validation'; //Validate comming request
import { createUser } from '../../controllers/user';

const app = express();
const validator = createValidator();

// Schema validate request body
const regiterSchema = Joi.object({
    userName: Joi.string()
        .required()
        .label("User name")
        .trim(),
    userEmail: Joi.string()
        .email()
        .required()
        .label("Email")
        .trim(),
    userPass: Joi.string()
        .required()
        .trim()
        .label("Password"),
    repeatPass: Joi.any().equal(Joi.ref('userPass'))
    .required()
    .label('Confirm password')
    .messages({ 'any.only': '{{#label}} does not match' })
});

app.post('/create-user', validator.body(regiterSchema,
    {
        joi: { convert: true, allowUnknow: false, abortEarly: false }
    }
), createUser)

export default app;