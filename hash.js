const bcrypt = require('bcrypt');
const { MD5 } = require('crypto-js');

// bcrypt.genSalt(10,(err,salt)=>{
//     if(err) return next(err);

//     bcrypt.hash('password123',salt,(err,hash)=>{
//         if(err) return next(err);
//         console.log(hash);
//     })
// })

// const secret = "mysecret"; //only the programmer knows
// const saltedSecret = "dasererearararara"; // above secret has been salted

// const user = {
//     id:1,
//     token: MD5('SDSERWREDDAD').toString() + saltedSecret
// }

// const receivedToken = '6c0c1206102eec4a561725d131c5828ddasererearararara';

// if (receivedToken === user.token){
//     console.log('Move Forward')
// }

// return console.log(user);

const user_id = '1000';
const secret = "mysecret";
const receivedToken = "eyJhbGciOiJIUzI1NiJ9.MTAwMA.n1bMGa04DxNY-hSxSqKwDr_jwC7ljkxxPCUMMTr4OjA";
const token = jwt.sign(user_id,secret);

const decodedToken = jwt.verify(receivedToken, secret);

console.log(decodedToken);