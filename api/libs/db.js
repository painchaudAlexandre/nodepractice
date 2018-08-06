var mongoose = require('mongoose');
mongoose.connect('mongodb://'+ process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_PORT, { useNewUrlParser: true });