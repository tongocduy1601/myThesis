const Joi = require('joi');

const userSchemas = {};

userSchemas.userPOST = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    carPlateNumber:Joi.string().required(),
    phone: Joi.string().min(10).required()
});

userSchemas.adminPOST=Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).required()
})

userSchemas.userPUT = Joi.object({
    username: Joi.string(),
    email: Joi.string().email(),
    currentPassword: Joi.string().min(6),
    password: Joi.string().min(6).required(),
    phone: Joi.number().min(10).required()
});

userSchemas.userLOGIN = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

userSchemas.userEmailVERIFICATION = Joi.object({
    email: Joi.string().email().required(),
});

userSchemas.userDELETE=Joi.object({
    username: Joi.string().required(),
});
userSchemas.userGET=Joi.object({
    username: Joi.string().required(),
});

module.exports = userSchemas;