const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const {auth} = require('./middleware/auth');


const app = express();


mongoose.Promise = global.Promise;// to make promise available with mongoose
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth',{useNewUrlParser:true})

const { User } = require('./models/user')
app.use(cookieParser());
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.status(200).send('Home');
})


app.post('/api/user',(req,res)=>{

    const user = new User({
        email:req.body.email,
        password:req.body.password
    })

    user.save((err,doc)=>{
        if(err) {
            res.status(400).send(err);
        }

        res.status(200).send(doc);
    })

})

app.post('/api/user/login',(req,res)=>{
    User.findOne({email:req.body.email},(err,user)=>{
        if(!user) return res.json({message:'Auth failed. User not found'});
        
        // bcrypt.compare(req.body.password,user.password,(err,isMatch)=>{
        //     if(err) throw err;
        //     res.status(200).send(isMatch);
        // })


        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(err) throw err;
            if(!isMatch) return res.status(400).send({
                message:'Wrong Password!'
            });
            //res.status(200).send(isMatch);
            user.generateToken(function(err,user){
                if(err) return res.status(400).send(err);

                res.cookie('auth',user.token).send('ok'); //(cookiename, value to be set)
            })
        })
    })
})

// app.post('/api/user/login',(req,res)=>{
//     let user = User.findOne({email:req.body.email},(err,user)=>{
//         if(!user) res.json({message:'Auth failed. User not found'});
        
//         // bcrypt.compare(req.body.password,user.password,(err,isMatch)=>{
//         //     if(err) throw err;
//         //     res.status(200).send(isMatch);
//         // })

//     })
//         user.comparePassword(req.body.password,(err,isMatch)=>{
//             if(err) throw err;
//             if(!isMatch) return res.status(400).send({
//                 message:'Wrong Password!'
//             });
//             res.status(200).send(isMatch);
//         })
   
// })


// retrieving cookie and comparing
app.get('/user/profile',auth,(req,res)=>{ //middleware "auth" is used
    
    res.status(200).send(req.token)   
    
})



const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Listening on port: ${port}`);
});