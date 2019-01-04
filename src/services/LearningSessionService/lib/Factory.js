const Api = require('./Api');
const Storage = require('./Storage');
const Service = require('./Service');

module.exports = class Factory {
    constructor(settings) {
        this.settings = settings || require('../settings.json');
        // TODO: Verify the settings object
    }

    createNewApiInstance(service, api) {
        return new Api(
            this.settings.api,
            service || this.createNewServiceInstance(),
            api
        );
    }
    createNewServiceInstance(storage) {
        return new Service(
            storage || this.createNewStorageInstance()
        );
    }
    createNewStorageInstance(storageSettings) {
        return new Storage(storageSettings || this.settings.storage);
    }
};