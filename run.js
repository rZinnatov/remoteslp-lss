const registerProcessEventHandlers = require('./lib/infrastructure/util').registerProcessEventHandlers;
const LearningSessionMicroServiceFactory = require('./index');

new LearningSessionMicroServiceFactory()
    .createApi()
    .then(api => {
        registerProcessEventHandlers(api);
        api.run();
    })
    .catch(console.error)
;
