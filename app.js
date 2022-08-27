const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');


const userRouter = require('./routes/user.router');
const {mainErrorHandler} = require("./errors");
const {MONGO_URL} = require("./configs/configs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/users', userRouter);

app.use('*', (req, res, next) => {
    next(new Error('Route not fount'))
})

app.use(mainErrorHandler)

app.listen(5000, () => {
    console.log('App listen 5000');
    mongoose.connect(MONGO_URL);

});