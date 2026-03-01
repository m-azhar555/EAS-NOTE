const dotenv =require('dotenv');
dotenv.config();
const express = require('express');
const AuthRouters = require('./routes/Auth');


const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json())
app.use('/auth',AuthRouters) 
 
app.listen(PORT,()=>{
    console.log(`app is running on port ${PORT}`)
});
