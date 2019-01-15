const logger = {
    info: function (message) { console.log(this.format(message)); },
    error: function (message) { console.error(this.format(message)); },
    format: (message) => `RemoteML(${process.pid}): ${message}`
};

function removeUndefinedProperties(object) {
    for (const key in object) {
        if (object[key] === undefined) {
            delete object[key];
        }
    }
}
function registerProcessEventHandlers(api) {
    async function stopService() {
        try {
            logger.info('LearningSessionService is stopping');
            await api.stop();
            logger.info('LearningSessionService is stopped');
            process.exit(0);
            
        } catch(error) {
            logger.error(`Error while stopping the service: '${error}'`);
            process.exit(1);
        }
    };
    async function signalHandler(signal) {
        logger.info(`Signal '${signal}' is caught`);
        await stopService();
    }
    async function uncaughtExceptionHandler(error) {
        logger.error(`Unhandled exception: ${error}`);
        await stopService();
    }
    async function unhandledRejectionHandler(reason, promise) {
        logger.error(`Unhandled rejection at: '${promise}' with reason '${reason}'`);
        await stopService();
    }
    
    process.on('exit', (code) => logger.info(`Exit process with code '${code}'`));
    process.on('SIGINT', signalHandler);
    process.on('SIGTERM', signalHandler);
    process.on('SIGHUP', signalHandler);
    process.on('SIGBREAK', signalHandler);
    process.on('uncaughtException', uncaughtExceptionHandler);
    process.on('unhandledRejection', unhandledRejectionHandler);
}


module.exports = {
    logger: logger,
    removeUndefinedProperties: removeUndefinedProperties,
    registerProcessEventHandlers: registerProcessEventHandlers
};