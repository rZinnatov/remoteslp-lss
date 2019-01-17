const ObjectID = require('mongodb').ObjectID;
const removeUndefinedProperties = require('../util').removeUndefinedProperties;


module.exports = class MongoRepository {
    constructor(collection) {
        this._collection = collection;
    }

    async selectById(id) {
        return await this._collection.findOne({
            _id: new ObjectID(id)
        });
    }
    async where(filterObject) {
        removeUndefinedProperties(filterObject);

        return await this._collection
            .find(filterObject)
            .toArray()
        ;
    }
    async insert(session) {
        const result = await this._collection.insertOne(session);

        if (result.insertedCount === 0) {
            throw new Error('No objects have been inserted');
        }

        return result.ops[0];
    }
    async update(id, state) {
        const result = await this._collection.updateOne(
            { _id: new ObjectID(id) },
            {
                $set: { state: state }
            }
        );

        return result.modifiedCount;
    }
    async delete(filterObject) {
        removeUndefinedProperties(filterObject);

        const result = await this._collection.deleteMany(filterObject);

        return result.deletedCount;
    }
    async deleteAll() {
        const result = await this._collection.deleteMany();

        return result.deletedCount;
    }
    async deleteById(id) {
        const result = await this._collection.deleteOne({
            _id: new ObjectID(id)
        });

        return result.deletedCount;
    }
};