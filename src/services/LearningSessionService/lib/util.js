module.exports = {
    removeUndefinedProperties: removeUndefinedProperties,
    registerProcessEventHandlers: registerProcessEventHandlers
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
            console.log(`RemoteML(${process.pid}): LearningSessionService is stopping`);
            await api.stop();
            console.log(`RemoteML(${process.pid}): LearningSessionService is stopped`);
            process.exit(0);
            
        } catch(error) {
            console.error(`RemoteML(${process.pid}): Error while stopping the service: '${error}'`);
            process.exit(1);
        }
    };
    async function signalHandler(signal) {
        console.log(`RemoteML(${process.pid}): Signal '${signal}' is caught`);
        await stopService();
    }
    async function uncaughtExceptionHandler(error) {
        console.error(`RemoteML(${process.pid}): Unhandled exception: ${error}`);
        await stopService();
    }
    async function unhandledRejectionHandler(reason, p) {
        console.error(`RemoteML(${process.pid}): Unhandled rejection at: '${p}' with reason '${reason}'`);
        await stopService();
    }
    
    process.on('exit', (code) => console.log(`RemoteML(${process.pid}): Exit process with code '${code}'`));
    process.on('SIGINT', signalHandler);
    process.on('SIGTERM', signalHandler);
    process.on('SIGHUP', signalHandler);
    process.on('SIGBREAK', signalHandler);
    process.on('uncaughtException', uncaughtExceptionHandler);
    process.on('unhandledRejection', unhandledRejectionHandler);
}