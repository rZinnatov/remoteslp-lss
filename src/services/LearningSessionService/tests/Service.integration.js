const createLearningSessionService = require('../index.js');

const clientId = 'client-123';
const anotherClientId = 'another-client-123';

beforeEach(async (done) => {
    const learningSessionService = createLearningSessionService();
    await learningSessionService.removeSessions(clientId);
    await learningSessionService.removeSessions(anotherClientId);

    done();
});
afterAll(async (done) => {
    const learningSessionService = createLearningSessionService();
    await learningSessionService.removeSessions(clientId);
    await learningSessionService.removeSessions(anotherClientId);

    done();
});

test('LearningSessionService can select newly registered session', async (done) => {
    const learningSessionService = createLearningSessionService();

    let registeredSession = undefined;
    let selectedSession = undefined;

    try
    {
        registeredSession = await learningSessionService.createSession(clientId);
        selectedSession = await learningSessionService.getSession(registeredSession.id);

    } catch (e) {
        console.error(e);
        expect(e).toBe(undefined);
    }

    expect(selectedSession).toEqual(registeredSession);

    done();
});
test('LearningSessionService can select list of sessions of a client', async (done) => {
    const learningSessionService = createLearningSessionService();

    await learningSessionService.createSession(clientId);
    await learningSessionService.createSession(clientId);
    await learningSessionService.createSession(clientId);
    await learningSessionService.createSession(anotherClientId);

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