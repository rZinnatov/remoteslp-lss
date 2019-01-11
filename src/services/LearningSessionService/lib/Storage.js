const ObjectID = require('mongodb').ObjectID;
const removeUndefinedProperties = require('./util').removeUndefinedProperties;


module.exports = class Storage {
    constructor(dbDriver) {
        this._dbDriver = dbDriver;
    }
    
    async stop() {
        await _stopMongoDbDriver();
    }
    async selectById(id) {
        const sessions = await this._dbDriver.getSessions();
        const learningSession = await sessions.findOne({
            _id: new ObjectID(id)
        });

        return learningSession;
    }
    async where(filterObject) {
        removeUndefinedProperties(filterObject);

        const sessions = await this._dbDriver.getSessions();
        const learningSessions = await sessions
            .find(filterObject)
            .toArray()
        ;

        return learningSessions;
    }
    async insert(session) {
        const sessions = await this._dbDriver.getSessions();
        const result = await sessions.insertOne(session);

        if (result.insertedCount === 0) {
            throw new Error('No objects have been inserted');
        }

        return result.ops[0];
    }
    async update(id, state) {
        const sessions = await this._dbDriver.getSessions();
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
        removeUndefinedProperties(filterObject);

        const sessions = await this._dbDriver.getSessions();
        const result = await sessions.deleteMany(filterObject);

        return result.deletedCount;
    }
    async deleteAll() {
        const sessions = await this._dbDriver.getSessions();
        const result = await sessions.deleteMany();

        return result.deletedCount;
    }
    async deleteById(id) {
        const sessions = await this._dbDriver.getSessions();
        const result = await sessions.deleteOne({
            _id: new ObjectID(id)
        });

        return result.deletedCount;
    }
};