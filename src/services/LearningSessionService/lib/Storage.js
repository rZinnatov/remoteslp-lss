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

module.exports = class Storage {
    async select(id) {
        const db = await _getDb();
        const learningSession = await db.collection.findOne({ _id: new ObjectID(id) });
        db.dispose();

        return learningSession;
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
};