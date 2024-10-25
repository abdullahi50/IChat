const { status } = require('express/lib/response');
const AppError = require('./../UTILS/appError')
const User = require('./../models/userModels');
const catchAsync = require('./../UTILS/catchAsync');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const sendEmail = require('./../UTILS/email');
const crypto = require('crypto')

const signToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })
};
const createSendToken = (user,statusCode,res) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date (
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt',token,cookieOptions);
    res.status(statusCode).json({
        status: 'success',
        token,
        data:{
            user
        }
    })
}
exports.Signup = catchAsync(async(req,res,next)=>{
    const newUser = await User.create(req.body);
    createSendToken(newUser,201,res)
});
exports.Login = exports.Login = catchAsync(async( req , res, next) =>{
    const {email , password} = req.body
    console.log(req.body)
    if(!email || !password){
      return next(new AppError('Please input your email and password',400))
    }
    const user = await User.findOne({email}).select('+password')
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }
    createSendToken(user, 200, res);
  })