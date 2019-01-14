const LearningSessionStates = require('./LearningSessionStates');

module.exports = class LearningSession {
    constructor(id, userId, state=LearningSessionStates.init) {
        this.id = id;
        this.userId = userId;
        this.state = state;
    }
};