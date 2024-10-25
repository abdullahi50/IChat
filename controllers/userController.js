const express = require('express')
const User = require('./../models/userModel')
const AppError = require('../UTILS/appError')


exports.createUsers = async (req,res,next) =>{
    const newUser = await User.create(req.body);
    res.status(200).json({
        newUser
    })
}


