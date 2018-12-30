const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;

async function _getDb() {
    // TODO: use connection pool
    // cleanup via https://github.com/jtlapp/node-cleanup
    // https://stackoverflow.com/questions/38693792/is-it-necessary-to-open-mongodb-connection-every-time-i-want-to-work-with-the-db

    const url = "mongodb://dbuser:dbpass1@ds145474.mlab.com:45474/remoteml";
    const mongoClient = await MongoClient.connect(url, { useNewUrlParser: true });
    return {
        collection: await mongoClient.db('remoteml').collection('learning_sessions'),
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
    async selectById(id) {
        const db = await _getDb();
        const learningSession = await db.collection.findOne({ _id: new ObjectID(id) });
        db.dispose();

        return learningSession;
    }
    async where(filterObject) {
        _removeUndefinedProperties(filterObject);

        const db = await _getDb();
        const learningSessions = await db.collection.find(filterObject).toArray();
        db.dispose();

        return learningSessions;
    }
    async insert(session) {
        const db = await _getDb();
        const result = await db.collection.insertOne(session);
        db.dispose();

        if (result.insertedCount === 0) {
            throw new Error('No objects have been inserted');
        }

        return result.ops[0];
    }
    async delete(filterObject) {
        _removeUndefinedProperties(filterObject);

        const db = await _getDb();
        const result = await db.collection.deleteMany(filterObject);
        db.dispose();

        return result.deletedCount;
    }
    async deleteAll() {
        const db = await _getDb();
        const result = await db.collection.drop();
        // TODO: Check what the result exactly is
        db.dispose();
    }
    async deleteById(id) {
        const db = await _getDb();
        const result = await db.collection.deleteOne({ _id: new ObjectID(id) });
        db.dispose();

        return result.deletedCount;
    }
};