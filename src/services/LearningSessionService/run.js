const LearningSessionServiceFactory = require('./index');
const api = new LearningSessionServiceFactory().createNewApiInstance();


process.on('exit', (code) => console.log(`RemoteML(${process.pid}): Exit process with code '${code}'`));
process.on('SIGINT', async () => {
    try {
        await api.stop();
        console.log(`RemoteML(${process.pid}): LearningSessionService is stopped`);
        process.exit(0);

    } catch(error) {
        console.error(`RemoteML(${process.pid}): Error in SIGINT handler`);
        console.error(error);
        process.exit(1);
    }
});


api.run();
