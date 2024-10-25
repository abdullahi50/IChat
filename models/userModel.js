const mongoose = require('mongoose');
const { type } = require('os');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please tell us your name ...']
    },
    password:{
        type: String,
        required :[true , 'Please input your password'],
        minlength : 8,
        select : false,
    },
    passwordConfirm:{
        type : String ,
        required :[true, 'Please confirm your password'],
        validate:{
            validator: function(el){
                return  el === this.password;
            },
        
            message: 'Passwords do not match'
        },
        passwordresetToken:String,

        
        passwordresetTokenExpires:Date

        
    },
    email:{
        type:String,
        required :[ true, 'Please provide an email'],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail , 'Please provide a valid email']
    },
})
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
const User = mongoose.model('User',userSchema)
module.exports  = User