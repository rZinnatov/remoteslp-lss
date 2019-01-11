const LearningSession = require('./domain/LearningSession');
const LearningSessionStates = require('./domain/LearningSessionStates');


module.exports = class Service {
    constructor(storage) {
        this._storage = storage;
    }

    async stop() {
        await this._storage.stop();
    }
    async getSession(id) {
        const item = await this._storage.selectById(id);
        if (item === null) {
            return null;
        }

        return new LearningSession(item._id, item.clientId, item.state);
    }
    async getSessions(clientId) {
        const items = await this._storage.where({ clientId: clientId });
        if (items === null) {
            return [];
        }

        return items.map(
            (item) => new LearningSession(item._id, item.clientId, item.state)
        );
    }
    async createSession(clientId) {
        const item = await this._storage.insert({
            clientId: clientId,
            state: LearningSessionStates.init
        });

        return new LearningSession(item._id, item.clientId, item.state);
    }
    async updateSession(id, state) {
        return await this._storage.update(id, state);
    }
    async removeAllSessions() {
        return await this._storage.deleteAll();
    }
    async removeSession(id) {
        return await this._storage.deleteById(id);
    }
    async removeSessions(clientId) {
        return await this._storage.delete({ clientId: clientId });
    }
};