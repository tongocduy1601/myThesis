const httpStatus = require("http-status");
const { HTTP_VERSION_NOT_SUPPORTED, NOT_EXTENDED, NETWORK_AUTHENTICATION_REQUIRED } = require("http-status");
const bookingModel=require("../models/booking.model");
const ParkModel=require("../models/park.model");
const {Parking}=require("../models/park.model");
const ApiError = require("../utils/ApiError");
const userService=require("../services/user.service");
const e = require("express");
const {Booking}=require("../models/booking.model");

async function booking(body,renter){
    const {parkName,blockName,address,carPlateNumber}=body;
    const block=await ParkModel.findParkbyparkName(parkName);
    if(block.availableSlot<0){
        throw new ApiError(httpStatus.NOT_IMPLEMENTED,"booking do not empty");
    };
    
    book=new Booking({
        parkName:parkName,
        renter:renter,
        currentBooking:true,
        startTime:Date.now(),  
        carPlateNumber:carPlateNumber,
        blockName:blockName,
        address:address
    });
    await book.save();   
    return book;
};  

async function currentSpent(userId){
    const {username}=await userService.getUserById(userId);
    const renter=username;
    const bookingbyRenter =await bookingModel.getBookingbyRenter(renter);
    const startTime=bookingbyRenter.startTime;
    const currentTime=new Date(Date.now());
    const hours = Math.floor(Math.abs(currentTime-startTime ) / 36e5);
    const blockContainRenter=await ParkModel.findParkbyparkName(bookingbyRenter.parkName);
    const day_price=blockContainRenter.day_price;
    const night_price=blockContainRenter.night_price;
    console.log(day_price,night_price);
    let remainHours=0;
    let fee=0;
    const hourInStartTime=startTime.getHours();
    const hourInEndTime=currentTime.getHours();
    if(hours>24){
        date=Math.floor(hours/24);
        remainHours=hours-date*24
        fee=day*(night_price+day_price);
    }
    else{
        remainHours=Math.floor(hours);
    }
    if(hourInEndTime<hourInStartTime){
        if(hourInStartTime<=18){
            fee=fee+2*day_price+night_price;
        }
        else{
            if(hourInStartTime<24){
                fee=fee+day_price+night_price;
            }
        }
    }else{
        if(hourInEndTime>18 ){
            if(hourInStartTime>=18){
                fee=fee+night_price;
            }
            else{
                fee=fee+day_price+night_price;
            }
            
        }else{
            fee=fee+day_price;
        }
    }
    return fee;
};

async function chagre(userId){
    const {username}=await userService.getUserById(userId);
    const renter=username;
    //const bookingbyRenter =await bookingModel.getbookingbyRenter(renter);
    const curentSpent=await currentSpent(userId);
    await bookingModel.deleteBookingbyRenter(renter);
    return curentSpent;
    //Payment(curentSpent); TBD
};

async function getInfo(userId){
    const {username}=await userService.getUserById(userId);
    const renter=username;
    const bookingbyRenter =await bookingModel.getBookingbyRenter(renter);
    const curentSpent=await currentSpent(userId);
    if(!!bookingbyRenter)
    return{
        carPlateNumber:bookingbyRenter.carPlateNumber,
        parkName:bookingbyRenter.parkName,
        blockName:bookingbyRenter.blockName,
        address:bookingbyRenter.address,
        spent:String(curentSpent),
    };
    
};
module.exports={
    booking,
    chagre,
    currentSpent,
    getInfo,
}