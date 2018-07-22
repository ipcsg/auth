const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_I = 10;
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    token:{
        type:String,
    }
})



//do password hashing before saving
userSchema.pre('save',function(next){//'pre' comes from mongoose - means before database save
    var user = this;//assign the value of this particular instance of user model

    if(user.isModified('password')){
        bcrypt.genSalt(SALT_I,function(err,salt){
            if(err) return next(err);

            bcrypt.hash(user.password,salt,function(err,hash){
                if(err) return next(err);
                user.password=hash;
                next();//proceed
            })
        })
        
        
    }else{
        next();//proceed
    }
})


userSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){

        if(err) throw cb(err);
        cb(null, isMatch);

    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    var token = jwt.sign(user._id.toHexString(),'supersecret');
    user.token = token;

    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);

    })
}


userSchema.statics.findByToken = function(token,cb){

    let user = this;

    jwt.verify(token,'supersecret',function(err,decode){
       
        user.findOne({"_id":decode,"token":token},function(err,user){
            if(err) return cb(err);
            cb(null,user);
        })
    })

    

}


const User = mongoose.model('User',userSchema); // this should come just before the export otherwise instance methods "comparePassword" stops working
module.exports = { User }