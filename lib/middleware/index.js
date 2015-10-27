var express = require('express')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , compression = require('compression')
    , path = require('path')
    , config = require('../../lib/config');

module.exports = function(app){
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(compression());
    app.use(express.static(path.join(__dirname, '../', config.get('staticContentPath')), {
        maxAge: (60 * 60 * 24 * 7) * 1000 // 7 days x 1000 because Express middleware expects miliseconds and not seconds
    }));

    app.use(function(req, res, next) {
        res.locals = config.getCurrent();
        next();
    });
};