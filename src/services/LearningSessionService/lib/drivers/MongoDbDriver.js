const MongoClient = require('mongodb').MongoClient;


module.exports = class MongoDbDriver {
    constructor(settings, logger) {
        this._settings = settings;
        this._logger = logger;
        
        this._mongoClient = undefined;
        this._sessionsCollection = undefined;
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
    
        this._logger.info('DB driver is closing');
        await this._mongoClient.close();
        this._logger.info('DB driver is closed');
    }
    async getSessions() {
        if (
            this.isConnected &&
            this._sessionsCollection != undefined
        ) {
            return this._sessionsCollection;
        }

        await this._connect();
    
        return this._sessionsCollection = await this._mongoClient
            .db(this._settings.dbName)
            .collection(this._settings.collectionName)
        ;
    }

    async _connect() {
        this._logger.info('Connect to db');
    
        this._mongoClient = await MongoClient.connect(
            this._settings.url,
            { useNewUrlParser: true }
        );
    }
};