
const mongoose = require('mongoose');

const ParkingSchema =mongoose.Schema(
    {
        owner:{          
            type:String,
          //  unique:true,
            trim:true             
        },
        day_price:{
            type:Number,
            trim:true
        },
        night_price:{
            type:Number,
            trim:true
        },
        parkName:{
            type:String,
            trim:true,
            unique:true,
        },
        slot_total:{
            type:Number,
        },
        availableSlot:{
            type:Number,
        },
    },

);
const Park=mongoose.model("Park",ParkingSchema);
async function updatePrice(owner,nightPrice,dayPrice){
    await Park.findOneAndUpdate({owner:owner},{night_price:nightPrice,day_price:dayPrice});
};
async function updateparkName(owner,parkName){
    await Park.findOneAndUpdate({owner:owner},{parkName:parkName});
};
async function updateSlotTotal(owner,total){
    await Park.findOneAndUpdate({owner:owner},{slot_total:total});
};
async function updateSlotAvaible(parkName,availableSlot){
    let park=await Park.findOneAndUpdate({parkName:parkName},{availableSlot:availableSlot});
    return park;
};
async function findOwner(owner){
    const parking=await Park.findOne({owner:owner});
    return !!parking;
};
async function findParkbyparkName(parkName){
    const park=await Park.findOne({parkName:parkName});
    return park;
};
module.exports={
    Park,
    updateparkName,
    updatePrice,
    updateSlotTotal,
    findOwner,
    findParkbyparkName,
    updateSlotAvaible,
};