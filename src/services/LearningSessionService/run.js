const registerProcessEventHandlers = require('./lib/util').registerProcessEventHandlers;
const LearningSessionServiceFactory = require('./index');

const api = new LearningSessionServiceFactory().createNewApiInstance();
registerProcessEventHandlers(api);

api.run();
