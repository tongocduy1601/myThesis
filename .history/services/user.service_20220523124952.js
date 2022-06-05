const userModel = require("../models/user.model");
const { User,isEmailTaken } = require("../models/user.model");
const tokenModel = require("../models/token.model");
const { Token } = tokenModel;
const tokenService = require('../services/token.service');
const { generateAccessToken, generateRefreshToken } = require('./token.service');
const ApiError = require('../utils/ApiError');
const { ROLE, VERIFY_TOKEN_TYPE } = require('../utils/constants');
const httpStatus = require('http-status');

async function signUp(body) {
  const { email, username, password,carPlateNumber,phone } = body;
  await createUser(email, username, password,carPlateNumber,phone);
 // await sendVerificationEmail(email);
}

async function createUser(email, username, password,carPlateNumber,phone) {
  if (await userModel.isEmailTaken(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email is taken");
  }
  const user = new User({
    username: username,
    email: email,
    role: ROLE.USER,
    password: password,
    carPlateNumber:carPlateNumber,
    phone:phone
  });
  await user.save();
  return user;
}
async function signUpAd(body){
  const { email, username, password,phone } = body;
  createAdmin(email, username, password,phone );
}
async function createAdmin(email, username, password,phone) {
  if (await userModel.isEmailTaken(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email is taken");
  }
  const user = new User({
    username: username,
    email: email,
    role: ROLE.ADMIN,
    password: password,
    phone:phone,
  });
  await user.save();
  return user;
}

async function deleteUser(userId) {
  const user = await userModel.getUserById(userId);
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "Course not found user");
  if (user.role === ROLE.USER) {
    await userModel.deleteUser(userId);
    console.log('deleted user');
  }
}

async function getAllUsers(role) {
  const users = await userModel.getAllUsers(role);
  return users;
}

async function getUserById(userId) {
  const user = await userModel.getUserById(userId);
  return user;
}


async function login(body) {
  const { email, password } = body;
  const user = await userModel.getUserByEmail(email);
  if (!!user) {

    const success = await user.validatePassword(password);
    if (!success) throw new ApiError(httpStatus.UNAUTHORIZED, "Email or password incorrect");
    const accessToken = generateAccessToken(user.email, user._id, user.role);
    const refreshToken = await generateRefreshToken(user._id);
    const resUser = await User.findById(user._id).select('_id username email role phone');
    return {
      user: resUser,
      accessToken: accessToken,
      refreshToken: refreshToken
    };

  }
  else {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email not exists");
  }
}

async function deleteUser(body) {
  const {username}=body;
  const result=await userModel.deleteUser(username);
  return result;
}


async function getUserByName(body) {
  const username=body;
  const user = await userModel.getUserByName(username);
  
  return user;
}
async function updateUserInfoByAdmin(userId, body) {
  let user = await userModel.getUserById(userId);
  const { username, email, password } = body;

  //only allow email update for teacher
  if (email && user.role === ROLE.TEACHER) user.email = email;
  if (username) user.username = username;
  if (password) user.password = password;
  await user.save();
  user = await userModel.getUserById(userId);
  return user;
}

async function updateUserInfo(userId, body) {
  let user = await User.findById(userId);
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'Not found user');
  const validPassword = await user.validatePassword(body.currentPassword);
  console.log(validPassword);
  if (!validPassword) throw new ApiError(httpStatus.UNAUTHORIZED, "Email or password incorrect");
  if (body.username) user.username = body.username;
  if (body.email) user.email = body.email;
  if (body.password) user.password = body.password;
  if (body.phone) user.phone=body.phone;
  await user.save();
  user = await userModel.getUserById(userId);
  return user;
}

async function resetPassword(userId, currentPassword, newPassword) {
  if (!currentPassword || !newPassword) throw new ApiError(httpStatus.BAD_REQUEST, "Required currentPassword, newPassword");
  const user = await User.findById(userId);
  const valid = await user.validatePassword(currentPassword);
  if (!valid) throw new ApiError(httpStatus.BAD_REQUEST, "Current password incorrect");
  else {
    user.password = newPassword;
    await user.save();
  }
  return user;
}

async function updateEmail(userId, currentPassword, newEmail) {
  const user = await User.findById(userId);
  if (user.email === newEmail) throw new ApiError(httpStatus.BAD_REQUEST, "Email not valid");
  const valid = await user.validatePassword(currentPassword);
  if (!valid) throw new ApiError(httpStatus.BAD_REQUEST, "Current password incorrect");
  else {
    await sendVerificationForNewEmail(userId, newEmail);
  }
}


async function findUserByRefreshToken(userId, refreshToken) {
  const user = await User.findOne({ _id: userId, refreshToken: refreshToken });
  return user;
}

function parseUserId(request, isAdmin) {
  const paramUserId = request.params.userId;
  const decodedUserId = tokenService.getPayloadFromRequest(request).userId;
  //return user id by bearer token 
  if (paramUserId === 'me') {
    return decodedUserId;
  }
  //if not admin => recheck paramId and decoded id
  if (!isAdmin) {
    if (decodedUserId != paramUserId) throw new ApiError(httpStatus.UNAUTHORIZED, 'Access Denied');
  }

  return paramUserId;
}

module.exports = {
  parseUserId,
  signUp,
  login,
  getAllUsers,
  updateUserInfoByAdmin,
  resetPassword,
  updateEmail,
  updateUserInfo,
  deleteUser,
  findUserByRefreshToken,
  signUpAd,
  getUserByName,
  getUserById,
}

