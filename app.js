const dotenv =require('dotenv');
dotenv.config();
const express = require('express');
const AuthRouters = require('./routes/Auth');


const app = express();
const connectDB = require('./db/connect')
app.use(express.json())
app.use('/auth',AuthRouters) 

const port = 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
