const express = require('express');
const auth=require("../middlewares/auth.mdw");
const {ROLE,VERIFY_TOKEN_TYPE }=require("../utils/constants");
const validdate=require('../middlewares/validate.mdw');
const asyncHandler=require('../utils/asyncHandler');
const parkService=require('../services/park.service');
const httpStatus = require('http-status');
const { Park } = require('../models/park.model');
const parkSchemas = require('../schemas/parking.schema');

const router = express.Router();

router.post('/',
  validdate(parkSchemas.parkPOST),
  auth([ROLE.ADMIN]),
  asyncHandler(async (req, res, next) => {
    await parkService.createBlock(req.body);
    return res.status(httpStatus.CREATED).json({ success: true });
  })
);
//  update slotAvailble from edge device,
router.put('/parking',
    asyncHandler(async (req,res,next)=>{
        const block=await parkService.updateSlotAvaible(req.body);
        //missing validate data
        //return parkName 
        return res.status(httpStatus.OK).json({block});
    })
);

router.post('/parking',
    validdate(parkSchemas.parkUpateSlotAvailable),
    asyncHandler(async (req,res,next)=>{
        const block=await parkService.updateSlotAvaible(req.body);
        //missing validate data
        //return parkName 
        return res.status(httpStatus.OK).json({success: true});
    })
);

router.put("/",
    auth([ROLE.ADMIN]),
    validdate(parkSchemas.parkPUT),
    asyncHandler(async (req,res,next)=>{
        const block=await parkService.updateParkInfo(req.body);
        return res.status(httpStatus.OK).json({block});
    })
);

router.get("/:parkName", 
    asyncHandler(async (req,res,next)=>{
        console.log(req.params.parkName);
        const block=await parkService.getBlockInfo(req.params.parkName);
        block.night_price=String(block.night_price);
        block.day_price=String(block.day_price);
        const o={
            day_price:String(block.day_price),
            night_price:String(block.night_price),
            parkName:block.parkName,
            availableSlot:String(block.availableSlot)
        };
        return res.status(httpStatus.OK).json(o);
    })
);

module.exports=router;