const LearningSessionService = require('./../lib/Service');

const clientId = 'client-123';
const anotherClientId = `${clientId}-123`;

beforeEach(async (done) => {
    const learningSessionService = new LearningSessionService();
    await learningSessionService.removeSessions(clientId);
    await learningSessionService.removeSessions(anotherClientId);

    done();
});
afterEach(async (done) => {
    const learningSessionService = new LearningSessionService();
    await learningSessionService.removeSessions(clientId);
    await learningSessionService.removeSessions(anotherClientId);

    done();
});

test('LearningSessionService can select newly registered session', async (done) => {
    const learningSessionService = new LearningSessionService();

    let registeredSession = undefined;
    let selectedSession = undefined;

    try
    {
        registeredSession = await learningSessionService.registerNew(clientId);
        selectedSession = await learningSessionService.getSession(registeredSession.id);

    } catch (e) {
        console.error(e);
        expect(e).toBe(undefined);
    }

    expect(selectedSession).toEqual(registeredSession);

    done();
});
test('LearningSessionService can select list of sessions of a client', async (done) => {
    const learningSessionService = new LearningSessionService();

    await learningSessionService.registerNew(clientId);
    await learningSessionService.registerNew(clientId);
    await learningSessionService.registerNew(clientId);
    await learningSessionService.registerNew(anotherClientId);

    let learningSessions = undefined;
    try
    {
        learningSessions = await learningSessionService.getSessions(clientId);

    } catch (e) {
        console.error(e);
        expect(e).toBe(undefined);
    }
    
    expect(learningSessions.length).toEqual(3);
    learningSessions.forEach(session => expect(session.clientId).toEqual(clientId));

    done();
});