require('babel-register');
const express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    ApiHelper = require(__root + 'libs/ApiHelper'),
    User = require(__root + 'user/User'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


const config = require(__root + 'libs/config'); // get config file

router.post('/login', (req, res) => {

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return ApiHelper.errorResponse(res, 'Error on the server.', '01');
        if (!user) return ApiHelper.errorResponse(res, 'No user found.' , '02', 404);

        // check if the password is valid
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return ApiHelper.errorResponse(res, 'Invalid password', '03', 401)

        // if user is found and password is valid
        // create a token
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        ApiHelper.successResponse(res, {token: token, user: user})
    });

});

router.get('/me', VerifyToken, (req, res, next) => {

    User.findById(req.userId, { password: 0 }, (err, user) => {
        if (err) return  ApiHelper.errorResponse(res, "There was a problem finding the user.", '01');
        if (!user) return  ApiHelper.errorResponse(res, "No user found.", '02', 404);
        ApiHelper.successResponse(res, user)
    });

});

module.exports = router;