const LearningSession = require('./entities/LearningSession');
const LearningSessionStates = require('./entities/LearningSessionStates');


module.exports = class LearningSessionService {
    constructor(storage) {
        this._storage = storage;
    }

    async stop() {
        await this._storage.stop();
    }
    async getSession(id) {
        const session = await this._storage.sessions.selectById(id);
        if (session === null) {
            return null;
        }

        return new LearningSession(session._id, session.userId, session.state);
    }
    async getSessions(userId) {
        const sessions = await this._storage.sessions.where({ userId: userId });
        if (sessions === null) {
            return [];
        }

        return sessions.map(
            (session) => new LearningSession(session._id, session.userId, session.state)
        );
    }
    async createSession(userId) {
        const session = await this._storage.sessions.insert({
            userId: userId,
            state: LearningSessionStates.init
        });

        return new LearningSession(session._id, session.userId, session.state);
    }
    async updateSession(id, state) {
        return await this._storage.sessions.update(id, state);
    }
    async removeAllSessions() {
        return await this._storage.sessions.deleteAll();
    }
    async removeSession(id) {
        return await this._storage.sessions.deleteById(id);
    }
    async removeSessions(userId) {
        return await this._storage.sessions.delete({ userId: userId });
    }
};