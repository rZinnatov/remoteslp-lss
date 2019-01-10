const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;


let _mongoClient;
let _sessionsCollection;
async function _stopMongoDbDriver() {
    if (_mongoClient == undefined) {
        return;
    }

    console.log(`RemoteML(${process.pid}): DB driver is closing`);
    await _mongoClient.close();
    console.log(`RemoteML(${process.pid}): DB driver is closed`);
}
async function _getSessions(settings) {
    if (
        _mongoClient != undefined && _mongoClient.isConnected() &&
        _sessionsCollection != undefined
    ) {
        return _sessionsCollection;
    }

    console.log(`RemoteML(${process.pid}): connect to db`);

    _mongoClient = await MongoClient.connect(
        settings.url,
        { useNewUrlParser: true }
    );

    return _sessionsCollection = await _mongoClient
        .db(settings.dbName)
        .collection(settings.collectionName)
    ;
}
function _removeUndefinedProperties(object) {
    for (const key in object) {
        if (object[key] === undefined) {
            delete object[key];
        }
    }
}

module.exports = class Storage {
    constructor(settings) {
        this.settings = settings;
    }
    
    async stop() {
        await _stopMongoDbDriver();
    }
    async selectById(id) {
        const sessions = await _getSessions(this.settings);
        const learningSession = await sessions.findOne({
            _id: new ObjectID(id)
        });

        return learningSession;
    }
    async where(filterObject) {
        _removeUndefinedProperties(filterObject);

        const sessions = await _getSessions(this.settings);
        const learningSessions = await sessions
            .find(filterObject)
            .toArray()
        ;

        return learningSessions;
    }
    async insert(session) {
        const sessions = await _getSessions(this.settings);
        const result = await sessions.insertOne(session);

        if (result.insertedCount === 0) {
            throw new Error('No objects have been inserted');
        }

        return result.ops[0];
    }
    async update(id, state) {
        const sessions = await _getSessions(this.settings);
        const result = await sessions.updateOne(
            {
                _id: new ObjectID(id)
            }, {
                $set: { state: state }
            }
        );

        return result.modifiedCount;
    }
    async delete(filterObject) {
        _removeUndefinedProperties(filterObject);

        const sessions = await _getSessions(this.settings);
        const result = await sessions.deleteMany(filterObject);

        return result.deletedCount;
    }
    async deleteAll() {
        const sessions = await _getSessions(this.settings);
        const result = await sessions.deleteMany();

        return result.deletedCount;
    }
    async deleteById(id) {
        const sessions = await _getSessions(this.settings);
        const result = await sessions.deleteOne({ _id: new ObjectID(id) });

        return result.deletedCount;
    }
};