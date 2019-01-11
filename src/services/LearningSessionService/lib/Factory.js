const Api = require('./Api');
const Storage = require('./Storage');
const Service = require('./Service');
const MongoDbDriver = require('./drivers/MongoDbDriver');
const ExpressJsDriver = require('./drivers/ExpressJsDriver');

module.exports = class Factory {
    constructor(settings) {
        this.settings = settings || require('../settings.json');
        // TODO: Verify the settings object
    }

    createNewApiInstance(service, apiDriver, app) {
        return new Api(
            service || this.createNewServiceInstance(),
            apiDriver || new ExpressJsDriver(this.settings.api, app)
        );
    }
    createNewServiceInstance(storage) {
        return new Service(
            storage || this.createNewStorageInstance()
        );
    }
    createNewStorageInstance(dbDriver) {
        return new Storage(
            dbDriver || new MongoDbDriver(this.settings.storage)
        );
    }
};