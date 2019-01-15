const MongoClient = require('mongodb').MongoClient;
const MongoRepository = require('./../MongoRepository');


module.exports = class MongoDbDriver {
    constructor(options) {
        this._logger = options.logger;
        this._settings = options.settings;
        
        this._mongoClient = undefined;
        this._sessionsRepository = undefined;
    }

    get isConnected() {
        return this._mongoClient != undefined &&
            this._mongoClient.isConnected()
        ;
    }

    async stop() {
        if (!this.isConnected) {
            return;
        }
    
        this._logger.info('DB driver is stopping');
        await this._mongoClient.close();
        this._logger.info('DB driver is stopped');
    }
    async getSessionsRepository() {
        if (
            this.isConnected &&
            this._sessionsRepository != undefined
        ) {
            return this._sessionsRepository;
        }

        await this._connect();
    
        const sessionsCollection = await this._mongoClient
            .db(this._settings.dbName)
            .collection(this._settings.collectionName)
        ;
        return this._sessionsRepository = new MongoRepository(sessionsCollection);
    }

    async _connect() {
        this._logger.info('Connect to db');
    
        this._mongoClient = await MongoClient.connect(
            this._settings.url,
            { useNewUrlParser: true }
        );
    }
};