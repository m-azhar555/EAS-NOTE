const express = require('express');

const AuthRouters= express.Router()

AuthRouters.post('/register',(req,res)=>{
    res.send('Hallo from register')
})


module.exports= AuthRouters; 