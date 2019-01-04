const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;


async function _getDb(settings) {
    // TODO: use connection pool
    // cleanup via https://github.com/jtlapp/node-cleanup
    // https://stackoverflow.com/questions/38693792/is-it-necessary-to-open-mongodb-connection-every-time-i-want-to-work-with-the-db

    const mongoClient = await MongoClient.connect(
        settings.url,
        { useNewUrlParser: true }
    );
    const collection = await mongoClient
        .db(settings.dbName)
        .collection(settings.collectionName)
    ;
    return {
        collection: collection,
        dispose: () => mongoClient.close()
    };
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
    async selectById(id) {
        const db = await _getDb(this.settings);
        const learningSession = await db.collection.findOne({ _id: new ObjectID(id) });
        db.dispose();

        return learningSession;
    }
    async where(filterObject) {
        _removeUndefinedProperties(filterObject);

        const db = await _getDb(this.settings);
        const learningSessions = await db.collection.find(filterObject).toArray();
        db.dispose();

        return learningSessions;
    }
    async insert(session) {
        const db = await _getDb(this.settings);
        const result = await db.collection.insertOne(session);
        db.dispose();

        if (result.insertedCount === 0) {
            throw new Error('No objects have been inserted');
        }

        return result.ops[0];
    }
    async delete(filterObject) {
        _removeUndefinedProperties(filterObject);

        const db = await _getDb(this.settings);
        const result = await db.collection.deleteMany(filterObject);
        db.dispose();

        return result.deletedCount;
    }
    async deleteAll() {
        const db = await _getDb(this.settings);
        const result = await db.collection.deleteMany();
        db.dispose();

        return result.deletedCount;
    }
    async deleteById(id) {
        const db = await _getDb(this.settings);
        const result = await db.collection.deleteOne({ _id: new ObjectID(id) });
        db.dispose();

        return result.deletedCount;
    }
};