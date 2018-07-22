
//creating middleware:----------------------------------------------

const { User } = require('./../models/user');

const auth = (req,res,next)=>{

    let token = req.cookies.auth;//here auth is cookie name

    User.findByToken(token,function(err,user){

        if(err) throw err;
        if(!user) return res.status('401').send('You have no access');

        // res.status('200').send('You have access')

        req.token =  token;
        next();
    })

}

module.exports = {auth}