const express = require('express');
const router = express.Router();
const httpStatus = require("http-status");
const asyncHandler = require('../utils/asyncHandler')
const userService = require('../services/user.service');
const tokenService = require('../services/token.service');
const auth = require('../middlewares/auth.mdw');
const validate = require('../middlewares/validate.mdw');
const userSchema = require('../schemas/user.schema');
const { ROLE, VERIFY_TOKEN_TYPE } = require('../utils/constants');
const ApiError = require('../utils/ApiError');

//create a user
router.post('/',
  validate(userSchema.userPOST),
  asyncHandler(async (req, res, next) => {
    await userService.signUp(req.body);
    return res.status(httpStatus.CREATED).json({ success: true, message: 'A verification email has been sent to email' });
  })
);
router.post('/admin',
  validate(userSchema.adminPOST),
  asyncHandler(async (req, res, next) => {
    await userService.signUpAd(req.body);
    return res.status(httpStatus.CREATED).json({ success: true });
  })
);


router.post('/login',
  validate(userSchema.userLOGIN),
  asyncHandler(async (req, res, next) => {
    const { user, accessToken, refreshToken } = await userService.login(req.body);
    if (!!accessToken)
      return res.status(httpStatus.OK).json({
        authenticated: true,
        user,
        accessToken,
        refreshToken
      });
    else
      return res.status(httpStatus.UNAUTHORIZED).json({ authenticated: false, });
  })
);

//update user info 
router.put('/:userId',
  auth(),
  validate(userSchema.userPUT),
  asyncHandler(async (req, res, next) => {
    const role = tokenService.getPayloadFromRequest(req).role;
    if (role === ROLE.ADMIN) {
      let userId = req.params.userId;
      //id from access token
      const decodedUserId = tokenService.getPayloadFromRequest(req).userId;
      if (userId === 'me') userId = decodedUserId; 
      //admin id === userId => edit admin info
      if (userId === decodedUserId) {
        const { currentPassword } = req.body;
        if (!currentPassword)
          return res.status(httpStatus.UNAUTHORIZED).json({
            error_message: 'currentPassword required'
          });
        const user = await userService.updateUserInfo(userId, req.body);
        return res.status(httpStatus.OK).json({ user });
      }

      //edit user info
      const user = await userService.updateUserInfoByAdmin(userId, req.body);
      return res.status(httpStatus.OK).json({ user });
    }
    //role: user
    else {
      const userId = userService.parseUserId(req, false);
      const { currentPassword } = req.body;
      if (!currentPassword)
        return res.status(httpStatus.UNAUTHORIZED).json({
          error_message: 'currentPassword required'
        });

      const user = await userService.updateUserInfo(userId, req.body);
      return res.status(httpStatus.OK).json({ user });
    }
}));
//get user by name
router.get('/:username',
  //validate(userSchema.userGET),
  asyncHandler(async (req, res, next) => {
    let username=req.params.username;
    const result = await userService.getUserByName(req.params.username);
    return res.status(httpStatus.OK).json(result);
  })
);


router.delete('/',
  validate(userSchema.userDELETE),
  asyncHandler(async (req, res, next) => {
    const result =await userService.deleteUser(req.body);
    return res.status(httpStatus.NO_CONTENT).json(result);
}));



//get user by id
module.exports = router;
