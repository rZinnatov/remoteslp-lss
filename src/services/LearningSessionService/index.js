const Storage = require('./lib/Storage');
const Service = require('./lib/Service');

function createNewService(config) {
    if (config === undefined) {
        config = {};
    }

    if (config.settings === undefined) {
        config.settings = require('./settings.json');
    }

    if (config.storage === undefined) {
        config.storage = new Storage(config.settings.storage);
    }

    return new Service(config.storage);
}
module.exports = createNewService;