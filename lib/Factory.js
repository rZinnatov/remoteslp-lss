const util = require('./util');
const Api = require('./Api');
const Storage = require('./Storage');
const Service = require('./Service');
const MongoDbDriver = require('./drivers/MongoDbDriver');
const ExpressJsDriver = require('./drivers/ExpressJsDriver');

module.exports = class Factory {
    constructor(options = {}) {
        this.settings = options.settings || require('../settings.json');
        // TODO: Verify the settings object

        this.logger = options.logger || util.logger;
    }

    createNewApiInstance(options = {}) {
        const expressJsDriverOptions = {
            logger: this.logger,
            settings: this.settings.api,
            expressJsApp: options.expressJsApp
        };

        return new Api(
            options.service || this.createNewServiceInstance(),
            options.apiDriver || new ExpressJsDriver(expressJsDriverOptions)
        );
    }
    createNewServiceInstance(storage) {
        return new Service(storage || this.createNewStorageInstance());
    }
    createNewStorageInstance(dbDriver) {
        const mongoDbDriverOptions = {
            logger: this.logger,
            settings: this.settings.storage
        };
        return new Storage(dbDriver || new MongoDbDriver(mongoDbDriverOptions));
    }
};