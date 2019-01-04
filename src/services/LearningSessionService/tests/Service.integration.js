const LearningSessionServiceFactory = require('../index.js');

const clientId = 'client-123';
const anotherClientId = 'another-client-123';

beforeEach(async () => {
    const learningSessionService = new LearningSessionServiceFactory()
        .createNewServiceInstance()
    ;
    await learningSessionService.removeSessions(clientId);
    await learningSessionService.removeSessions(anotherClientId);
});
afterAll(async () => {
    const learningSessionService = new LearningSessionServiceFactory()
        .createNewServiceInstance()
    ;
    await learningSessionService.removeSessions(clientId);
    await learningSessionService.removeSessions(anotherClientId);
});

test('LearningSessionService can select newly registered session', async () => {
    const learningSessionService = new LearningSessionServiceFactory()
        .createNewServiceInstance()
    ;

    let registeredSession = undefined;
    let selectedSession = undefined;

    try
    {
        registeredSession = await learningSessionService.createSession(clientId);
        selectedSession = await learningSessionService.getSession(registeredSession.id);

    } catch (error) {
        console.error(error);
        expect(error).toBe(undefined);
    }

    expect(selectedSession).toEqual(registeredSession);
});
test('LearningSessionService can select list of sessions of a client', async () => {
    const learningSessionService = new LearningSessionServiceFactory()
        .createNewServiceInstance()
    ;

    await learningSessionService.createSession(clientId);
    await learningSessionService.createSession(clientId);
    await learningSessionService.createSession(clientId);
    await learningSessionService.createSession(anotherClientId);

    let learningSessions = undefined;
    try
    {
        learningSessions = await learningSessionService.getSessions(clientId);

    } catch (error) {
        console.error(error);
        expect(error).toBe(undefined);
    }
    
    expect(learningSessions.length).toEqual(3);
    learningSessions.forEach(session => expect(session.clientId).toEqual(clientId));
});