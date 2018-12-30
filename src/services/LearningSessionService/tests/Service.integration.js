// TODO: Use jest
const LearningSessionService = require('./services/LearningSessionService/');

const learningSessionService = new LearningSessionService();
learningSessionService
    .registerNew('client-123')
    .then(session => {
        console.log(session);
        learningSessionService
            .getSession(session.id)
            .then(session => console.log(session))
            .catch(e => console.error(e))
    })
    .catch(e => console.error(e))
;