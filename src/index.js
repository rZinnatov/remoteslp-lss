const LearningSessionService = require('./services/LearningSessionService');

const learningSessionService = new LearningSessionService(
    require('uuid/v4')
);