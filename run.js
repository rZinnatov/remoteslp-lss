const registerProcessEventHandlers = require('./lib/util').registerProcessEventHandlers;
const LearningSessionServiceFactory = require('./index');

new LearningSessionServiceFactory()
    .createNewApiInstance()
    .then(api => {
        registerProcessEventHandlers(api);
        api.run();
    })
    .catch(console.error)
;
