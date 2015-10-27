var express = require('express')
    , app = express()
    , router = express.Router()
    , swig = require('swig')
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

require('./lib/middleware')(app);
require('./lib/routes/http')(app, router);

var server = app.listen(config.get('port'), function() {
    console.info('server running: ' + JSON.stringify(server.address()));
    console.log('env: ' + config.get('env'));
});
