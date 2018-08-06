require('babel-register');
require('dotenv').config()
const express = require('express'),
      app = express(),
      ioClient = require('socket.io-client')
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'),
    apiClient = require('./libs/ApiClient'),
    session = require('express-session'),
    fs = require('fs');
app.use(session({secret: 'secretkid'}));
global.__root   = __dirname + '/';

var sess = null

app.get('/', (req, res) => {
    sess = req.session
    // apiClient.createUser({
    //     name: "painchaud",
    //     firstName: "alex",
    //     email: "al@test.fr",
    //     password: "1234",
    // }).then((result) =>
    // {
    //     if(result.body.success) {
    //         apiClient.authenticate('al@test.fr', '1234').then((result) => {
    //             console.log('RESULT LOGIN : ', result.body, result.response.statusCode)
    //             if(result.body.success) {
    //                 sess.token = result.body.result.token
    //                 sess.user =
    //             }
    //         }, (err) => {
    //             console.log('ERROR LOGIN => ', err);
    //         })
    //     }
    // }, (err) => {
    //     console.log('ERROR CREATE => ', err);
    // })
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', (socket, pseudo) => {
    socket.on('registration', (user) => {
        console.log('REGISTRATION', user.name)

        apiClient.createUser(user).then((result) =>
            {
                let response = {}
                if(result.body.success) {
                    response.user = result.body.result
                }
                response.success = result.body.success
                socket.emit('registration_response',response)
            }, (err) => {
                console.log('ERROR CREATE => ', err);
                socket.emit('registration_response',{success: false})
            })
    })
    socket.on('authenticate', (credentials) => {
        console.log('authenticate FRONT ', credentials.email)

        apiClient.authenticate(credentials.email, credentials.password).then((result) => {
            console.log('RESULT authenticate : ', result.body, result.response.statusCode)
            let response = {}
            if(result.body.success) {
                sess.token = result.body.result.token
                sess.user = result.body.result.user
                response.user = result.body.result.user
            }
            response.success = result.body.success
            socket.emit('authenticate_response',response)
        }, (err) => {
            console.log('ERROR authenticate => ', err);
            socket.emit('authenticate_response',{success: false})
        })
    })
    socket.on('nouveau_client', (pseudo) => {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    socket.on('message', (message) => {
        console.log('YEAH DUDEEEEEEEEEEEEEEEEEEE',sess.token)
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    });
});

server.listen(process.env.EXPRESS_PORT, () => {
    console.log('Front express listening on port ' + process.env.EXPRESS_PORT);
});