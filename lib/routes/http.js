var config = require('../../lib/config');

module.exports = function(app, router){
    router.get('/', require('../../lib/templates/views/index'));
    router.get('/1', require('../../lib/templates/views/page1'));
    router.get('/2', require('../../lib/templates/views/page2'));

    router.use(function(err, req, res, next){

        if(err.status !== 404){
            return next();
        }

        res.render('errors/404', {
            err: err
        });
    });

    app.use(config.get('baseUrl'), router);
};