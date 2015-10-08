var express = require('express')
    , app = express()
    , router = express.Router()
    , swig = require('swig')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , compression = require('compression')
    , config = require('./lib/config')
    , path = require('path');

config.configure(process.env.NODE_ENV || 'development');
app.engine('html', swig.renderFile);
app.set('view cache', false);

swig.setDefaults({
    cache: false
});

app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'lib', 'templates', 'views'));

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

// For a realworld app, you would probably want to seperate app, routes and middleware into seperate files
router.get('/', require('./lib/templates/views/index'));
router.get('/1', require('./lib/templates/views/page1'));
router.get('/2', require('./lib/templates/views/page2'));

app.use(config.get('baseUrl'), router);

app.get('*', function(req, res, next){
    var err = new Error();
        err.status = 404;
        err.url = req.url;

    next(err);
});

app.use(function(err, req, res, next){

    if(err.status !== 404){
        return next();
    }

    res.render('errors/404', {
        err: err
    });
});

var server = app.listen(config.get('port'), function() {
    console.info('server running: ' + JSON.stringify(server.address()));
    console.log('env: ' + config.get('env'));
});
