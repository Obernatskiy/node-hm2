const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const mongoose = require('mongoose');
// const mongoose = require('mongoose');


const {authRouter, userRouter} = require('./routes');
const {mainErrorHandler} = require("./errors");
const {MONGO_URL} = require("./configs/config");
const runCronJobs = require('./cron');

const app = express();

const server = http.createServer(app);

const io = socketIo(server, {cors: 'http://localhost:63342'});

io.on('connection', (socket) => {
    console.log('=========================================================');
    console.log(socket.id);
    console.log(socket.handshake.auth);
    console.log('=========================================================');

    socket.on('message:create', (data) => {
        console.log('data _________');
        console.log(data);
        console.log('data _________');
    });


    // EMIT EVENT TO SENDER
    // socket.emit('user:create', { name: 'Socket', hard: 10 });

    // EMIT EVENT ALL USERS INCLUDE SENDER
    // io.emit('user:create', { name: 'Socket', hard: 10 });

    // EMIT EVENT ALL USERS EXCLUDE SENDER
    socket.broadcast.emit('user:create', {name: 'Socket', hard: 10});

    socket.on('room:join', (data) => userJoinRoom(io, socket, data));
});


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(fileUpload({}));

app.use('/users', userRouter);
app.use('/auth', authRouter);

app.use('*', (req, res, next) => {
    next(new Error('Route not fount'))
})

app.use(mainErrorHandler)

server.listen(5000, () => {
    console.log('App listen 5000');
    mongoose.connect(MONGO_URL);

    runCronJobs();
});