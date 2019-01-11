const LearningSessionStates = require('./LearningSessionStates');

module.exports = class LearningSession {
    constructor(id, clientId, state=LearningSessionStates.init) {
        this.id = id;
        this.clientId = clientId;
        this.state = state;
    }
};