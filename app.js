var express = require('express')
    , app = express()
    , swig = require('swig')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , compression = require('compression')
    , config = require('./lib/config')
    , path = require('path')
    , env = process.env.NODE_ENV || 'development';

config.configure(env);
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
    res.locals.env = process.env.NODE_ENV || 'development';
    res.locals.root = config.get('root');
    res.locals.port = config.get('port');
    res.locals.siteName = config.get('siteName');
    next();
});

// You would probably want to seperate routes and middleware into seperate files
app.get('/', require('./lib/templates/views/index'));
app.get('/1', require('./lib/templates/views/page1'));
app.get('/2', require('./lib/templates/views/page2'));

app.get('*', function(req, res, next){
    var err = new Error();
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next){

    if(err.status !== 404){
        return next();
    }

    res.render('errors/404');
});

var server = app.listen(config.get('port'), function() {
    console.info('server running: ' + JSON.stringify(server.address()));
});
