const Joi = require('joi');

const {EMAIL, PASSWORD} = require('../constants/regex.enum')
const {ApiError} = require("../errors");
const {BAD_REQUEST} = require("../constants/statusCode.enum");

const newUserValidator =Joi.object({
    name:Joi.string().alphanum().min(2).max(35).trim().required(),
    age:Joi.number().integer().min(1).max(120),
    email:Joi.string().regex(EMAIL).lowercase().trim().required().error(new ApiError('Email not valid',BAD_REQUEST)),
    password:Joi.string().regex(PASSWORD).required().error(new ApiError('Password not valid',BAD_REQUEST)),

})

module.exports = {newUserValidator}