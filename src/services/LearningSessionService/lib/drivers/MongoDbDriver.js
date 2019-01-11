const MongoClient = require('mongodb').MongoClient;

module.exports = class MongoDbDriver {
    constructor(settings) {
        this._settings = settings;
        
        this._mongoClient = undefined;
        this._sessionsCollection = undefined;
    }

    get isConnected() {
        return
            this._mongoClient != undefined &&
            this._mongoClient.isConnected()
        ;
    }

    async stop() {
        if (!this.isConnected) {
            return;
        }
    
        console.log(`RemoteML(${process.pid}): DB driver is closing`);
        await this._mongoClient.close();
        console.log(`RemoteML(${process.pid}): DB driver is closed`);
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
        console.log(`RemoteML(${process.pid}): connect to db`);
    
        this._mongoClient = await MongoClient.connect(
            this._settings.url,
            { useNewUrlParser: true }
        );
    }
};