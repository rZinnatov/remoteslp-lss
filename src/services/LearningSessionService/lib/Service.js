const Storage = require('./Storage');
const LearningSession = require('../../../domain/LearningSession');
const LearningSessionStates = require('../../../domain/LearningSessionStates');

module.exports = class Service {
    constructor(storage) {
        if (storage == undefined) {
            storage = new Storage();
        }
        if (typeof storage !== 'object') {
            throw new TypeError('storage must be an object');
        }
        this.storage = storage;
    }

    async getSession(id) {
        const item = await this.storage.select(id);
        return new LearningSession(item._id, item.clientId, item.state);
    }
    async registerNew(clientId) {
        const item = await this.storage.insert({
            clientId: clientId,
            state: LearningSessionStates.init
        });

        return new LearningSession(item._id, item.clientId, item.state);
    }
};