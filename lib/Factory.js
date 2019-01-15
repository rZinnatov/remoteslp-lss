const LearningSessionService = require('./domain/LearningSessionService');

const RestApi = require('./api/RestApi');
const ExpressJsDriver = require('./api/ExpressJsDriver');

const util = require('./infrastructure/util');
const Storage = require('./infrastructure/data/Storage');
const MongoDbDriver = require('./infrastructure/data/MongoDbDriver');


module.exports = class Factory {
    constructor(options = {}) {
        this.settings = options.settings || require('../settings.json');
        // TODO: Verify the settings object

        this.logger = options.logger || util.logger;
    }

    async createApi(options = {}) {
        const expressJsDriverOptions = {
            logger: this.logger,
            settings: this.settings.api,
            expressJsApp: options.expressJsApp
        };

        return new RestApi(
            options.service || await this.createService(),
            options.apiDriver || new ExpressJsDriver(expressJsDriverOptions)
        );
    }
    async createService(storage) {
        return new LearningSessionService(storage || await this.createStorage());
    }
    async createStorage(dbDriver) {
        const mongoDbDriverOptions = {
            logger: this.logger,
            settings: this.settings.storage
        };
        return await Storage.create(dbDriver || new MongoDbDriver(mongoDbDriverOptions));
    }
};