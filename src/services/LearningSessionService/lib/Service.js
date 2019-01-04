const LearningSession = require('../../../domain/LearningSession');
const LearningSessionStates = require('../../../domain/LearningSessionStates');


module.exports = class Service {
    constructor(storage) {
        this.storage = storage;
    }

    async getSession(id) {
        const item = await this.storage.selectById(id);
        if (item === null) {
            return null;
        }

        return new LearningSession(item._id, item.clientId, item.state);
    }
    async getSessions(clientId) {
        const items = await this.storage.where({ clientId: clientId });
        if (items === null) {
            return [];
        }

        return items.map((item) => new LearningSession(item._id, item.clientId, item.state));
    }
    async createSession(clientId) {
        const item = await this.storage.insert({
            clientId: clientId,
            state: LearningSessionStates.init
        });

        return new LearningSession(item._id, item.clientId, item.state);
    }
    async removeAll() {
        return await this.storage.deleteAll();
    }
    async removeSession(id) {
        return await this.storage.deleteById(id);
    }
    async removeSessions(clientId) {
        return await this.storage.delete({ clientId: clientId });
    }
};