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

    async createNewApiInstance(options = {}) {
        const expressJsDriverOptions = {
            logger: this.logger,
            settings: this.settings.api,
            expressJsApp: options.expressJsApp
        };

        return new Api(
            options.service || await this.createNewServiceInstance(),
            options.apiDriver || new ExpressJsDriver(expressJsDriverOptions)
        );
    }
    async createNewServiceInstance(storage) {
        return new Service(storage || await this.createNewStorageInstance());
    }
    async createNewStorageInstance(dbDriver) {
        const mongoDbDriverOptions = {
            logger: this.logger,
            settings: this.settings.storage
        };
        return await Storage.create(dbDriver || new MongoDbDriver(mongoDbDriverOptions));
    }
};