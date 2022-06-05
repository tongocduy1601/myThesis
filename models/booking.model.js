
const mongoose = require('mongoose');

const bookingSchema =mongoose.Schema(
    {
        parkName:{
            type:String,
            trim:true,
            required:true
        },
        renter:{
            type:String,
            unique:true
        },
        currentBooking:{
            type:Boolean,
            required:true
        },
        startTime:{
            type:Date,
            required:true
        },
        carPlateNumber:{
            type:String,
            required:true
        },
        blockName:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true,
        },
        
    }
);
const Booking=mongoose.model("booking",bookingSchema);


async function updateStartTime(renter,startTime){
    await Booking.findOneAndUpdate({renter:renter},{startTime:startTime});
};
async function getBookingbyRenter(renter){
    const book= await Booking.findOne({renter:renter});
    return book;
};
async function deleteBookingbyRenter(renter){
    await Booking.deleteOne({renter:renter});
};
module.exports={
    Booking,
    updateStartTime,
    getBookingbyRenter,
    deleteBookingbyRenter,
}