const httpStatus = require("http-status");
const { HTTP_VERSION_NOT_SUPPORTED, NOT_EXTENDED } = require("http-status");
const ParkingModel=require("../models/park.model");
const {Park}=require("../models/park.model");
const ApiError = require("../utils/ApiError");

async function updateParkInfo(body){
    const {owner,parkName,slot_total,night_price,day_price}=body;
    if(ParkingModel.findOwner(owner)){

        ParkingModel.updatePrice(owner,night_price,day_price);
        if(ParkingModel.findParkbyparkName(parkName)==null){
            ParkingModel.updateparkName(owner,parkName);
        } 
        ParkingModel.updateSlotTotal(owner,slot_total); 
    }
    else{
        throw new ApiError(httpStatus.BAD_REQUEST,"onwer does not exist");
    }
    //console.log(await ParkingModel.findOwner(owner))
    ParkingModel.findParkbyparkName(parkName);
    return ParkingModel.findParkbyparkName(parkName);
}

async function createBlock(body){
    const {owner,parkName,slot_total,day_price,night_price,availableSlot}=body;
   // if(await BlockModel.findOwner(owner)){
   //     throw new ApiError(httpStatus.BAD_REQUEST, "onwer is existed !");
   // }
    const park= new Park({
        owner:owner,
        parkName:parkName,
        slot_total:slot_total,
        day_price:day_price,
        night_price:night_price,
        availableSlot:availableSlot,
    });
    await park.save();
}
async function updateSlotAvaible(body){
    const {parkName,availableSlot}=body;
   // console.log(parkingName,parkName,availableSlot);
    const block=await ParkingModel.updateSlotAvaible(parkName,availableSlot);
    if(block==null){
        throw new ApiError(httpStatus.BAD_REQUEST, "parkName does not existed !");
    }
    return block;
    
};
async function getBlockInfo(body){
    const parkName=body;
    const block =await ParkingModel.findParkbyparkName(parkName);
    return block;
}
module.exports={
    createBlock,
    updateParkInfo,
    updateSlotAvaible,
    getBlockInfo
}