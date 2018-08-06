require('babel-register');
const express = require('express'),
      app = express(),
      expressValidator = require('express-validator'),
      bodyParser = require('body-parser'),
      VerifyToken = require(__root + 'auth/VerifyToken'),
      ApiHelper = require(__root + 'libs/ApiHelper'),
      bcrypt = require('bcryptjs'),
      User = require('./User');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(expressValidator())

function validateUser(req, res, next) {
    req.checkBody('name', 'Name must not be empty').notEmpty();
    req.checkBody('firstName', 'Firstname must not be empty').notEmpty();
    req.checkBody('email', 'Email must not be empty').notEmpty();
    req.checkBody('password', 'Password must not be empty').notEmpty();


    var errors = req.validationErrors();
    if (errors) {
        let errorString = ''
        errors.forEach(function(err) {
            errorString += err.msg +  "\n"
        });

        return  ApiHelper.errorResponse(res, errorString, '30', 400)
    }

    return next();
}
app.post('/', validateUser, (req, res) => {
    User.create({
            name : req.body.name,
            email : req.body.email,
            firstName : req.body.firstname,
            password : bcrypt.hashSync(req.body.password, 8)
        },
         (err, user) => {
            if (err) return ApiHelper.errorResponse(res, 'There was a problem adding the information to the database.', '01')
            ApiHelper.successResponse(res, user)
        });
});

app.get('/',VerifyToken, (req, res) => {
    User.find({}, (err, users) => {
        if (err) ApiHelper.errorResponse(res, 'There was a problem finding the users.', '01')
        ApiHelper.successResponse(res, users)
    });
});


app.get('/:id',VerifyToken, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) return ApiHelper.errorResponse(res,"There was a problem finding the user.",'01')
        if (!user) return ApiHelper.errorResponse(res, 'User Not Found', '02', 404)
        ApiHelper.successResponse(res, user)
    });
});

app.delete('/:id',VerifyToken, (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: "+ user.name +" was deleted.");
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
app.put('/:id', /* VerifyToken, */ function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) ApiHelper.errorResponse(res, 'There was a problem updating the user.', '01')
        ApiHelper.successResponse(res, user)
    });
});


module.exports = app;