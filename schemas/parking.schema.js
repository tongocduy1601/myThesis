const Joi = require('joi');

const ParkingSchemas = {};

ParkingSchemas.parkPOST = Joi.object({
    parkName:Joi.string().required(),
    owner: Joi.string().required(),
    day_price:Joi.number().required(),
    night_price:Joi.number().required(),
    slot_total: Joi.number().required(),
    availableSlot:Joi.number().required(),
});


ParkingSchemas.parkPUT = Joi.object({
    parkName:Joi.string().required(),
    owner: Joi.string().required(),
    day_price:Joi.number().required(),
    night_price:Joi.number().required(),
    slot_total: Joi.number().required(),
    availableSlot:Joi.number().required(),
});
ParkingSchemas.parkUpateSlotAvailable=Joi.object({
    parkName:Joi.string().required(),
    parkingName:Joi.string().required(),
});
module.exports = ParkingSchemas;