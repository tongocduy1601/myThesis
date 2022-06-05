const Joi = require('joi');

const bookingSchemas = {};

bookingSchemas.blockBOOKING = Joi.object({
    parkName:Joi.string().required(),
    carPlateNumber:Joi.string().required(),
    address:Joi.string().required(),
    blockName:Joi.string().required(),

});

bookingSchemas.blockPUT = Joi.object({
    parkName:Joi.string().required(),
    owner: Joi.string().required(),
    price:Joi.number().required(),
    slot_total: Joi.number().required(),
    availableSlot:Joi.number().required(),
});

module.exports = bookingSchemas;