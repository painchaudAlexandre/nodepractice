require('babel-register');
require('dotenv').config()
const express = require('express'),
      db = require('./libs/db'),
      ent = require('ent'),
      fs = require('fs'),
      app = express();

global.__root   = __dirname + '/';


const UserController = require(__root + 'user/UserController');
app.use('/api/users', UserController);

const AuthController = require(__root + 'auth/AuthController');
app.use('/api/auth', AuthController);


app.listen(process.env.EXPRESS_PORT, () => {
    console.log('APi Express listening on port ' + process.env.EXPRESS_PORT);
});