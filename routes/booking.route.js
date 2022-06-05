const express = require('express');
const validate=require("../middlewares/validate.mdw");
const router = express.Router();
const auth=require('../middlewares/auth.mdw');
const asyncHandler = require('../utils/asyncHandler');
const { ROLE } = require('../utils/constants');
const bookingSchema = require('../schemas/booking.schema');
const bookingService=require('../services/booking.service');
const tokenService=require('../services/token.service');
const httpStatus = require("http-status");
const userService = require('../services/user.service');

router.post('/booking',
    auth([ROLE.USER]),
    validate(bookingSchema.blockBOOKING),
    asyncHandler(async(req,res,next)=>{
        const userId=await tokenService.getPayloadFromRequest(req).userId;
        const {username}=await userService.getUserById(userId);
        const renter=username;   
        const slot2Booking=await bookingService.booking(req.body,renter);
        if(slot2Booking==null){
            return res.status(httpStatus.OK).json({  });
        }
        return res.status(httpStatus.OK).json({ success: true });
    })
)

router.get("/spent",
    asyncHandler(async(req,res,next)=>{
        const userId=await tokenService.getPayloadFromRequest(req).userId;
        const spend=await bookingService.currentSpent(userId);
        return res.status(httpStatus.OK).json({ "price":spend });
    })
)
router.get("/",
    asyncHandler(async(req,res,next)=>{
        const userId=await tokenService.getPayloadFromRequest(req).userId;
        const info=await bookingService.getInfo(userId);
        return res.status(httpStatus.OK).json(info);
    })
)
router.delete("/charge",
    auth([ROLE.USER]),
    asyncHandler(async(req,res,next)=>{
        const userId=await tokenService.getPayloadFromRequest(req).userId;
        let spentMoney=await bookingService.chagre(userId);
        return res.status(httpStatus.OK).json({ "amount":spentMoney });;
    })
)

module.exports = router;