const express = require('express');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const mongoose = require('mongoose');


const {authRouter, userRouter} = require('./routes');
const {mainErrorHandler} = require("./errors");
const {MONGO_URL} = require("./configs/config");
const runCronJobs = require('./cron');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(fileUpload({}));

app.use('/users', userRouter);
app.use('/auth', authRouter);

app.use('*', (req, res, next) => {
    next(new Error('Route not fount'))
})

app.use(mainErrorHandler)

app.listen(5000, () => {
    console.log('App listen 5000');
    mongoose.connect(MONGO_URL);

    runCronJobs();
});