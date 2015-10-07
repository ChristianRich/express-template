var _ = require('lodash')
    , extend = require('extend')
    , defaultConfig = require('./config/default')
    , runtimeConfig
    , currentConfig;

module.exports = {

    configure : function (env) {

        if(currentConfig) {
            throw new Error('Config already initialized for environment: ' + env);
        }

        try{
            runtimeConfig = require('./config/' + env);
        } catch(e){
            throw new Error('Could not load config file for NODE_ENV: "' + env + '"');
        }

        currentConfig = extend(true, {}, defaultConfig, runtimeConfig);
        currentConfig.env = env;
    },

    get : function (key) {

        if(!currentConfig) {
            throw new Error('Config not initialized');
        }

        if(_.isUndefined(currentConfig[key])){
			return null;
        }

        return currentConfig[key];
    },

	set: function(key, value){

		if(!currentConfig) {
			throw new Error('Config not initialized');
		}

		currentConfig[key] = value;
	},

    getCurrent : function() {
        return currentConfig;
    }
};
