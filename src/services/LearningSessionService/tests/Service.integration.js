const LearningSessionServiceFactory = require('../index.js');
const LearningSessionStates = require('../../../domain/LearningSessionStates');


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
    let registeredSession = undefined;
    let selectedSession = undefined;

    try
    {
        const learningSessionService = new LearningSessionServiceFactory()
            .createNewServiceInstance()
        ;
    
        registeredSession = await learningSessionService.createSession(clientId);
        selectedSession = await learningSessionService.getSession(registeredSession.id);

    } catch (error) {
        console.error(error);
        expect(error).toBe(undefined);
    }

    expect(selectedSession).toEqual(registeredSession);
});
test('LearningSessionService can select list of sessions of a client', async () => {
    let learningSessions = undefined;
    try
    {
        const learningSessionService = new LearningSessionServiceFactory()
            .createNewServiceInstance()
        ;
    
        await learningSessionService.createSession(clientId);
        await learningSessionService.createSession(clientId);
        await learningSessionService.createSession(clientId);
        await learningSessionService.createSession(anotherClientId);
        
        learningSessions = await learningSessionService.getSessions(clientId);

    } catch (error) {
        console.error(error);
        expect(error).toBe(undefined);
    }
    
    expect(learningSessions.length).toEqual(3);
    learningSessions.forEach(session => expect(session.clientId).toEqual(clientId));
});
test('LearningSessionService can update session', async () => {
    let session = undefined;
    let modifiedCount = undefined;
    let updatedSession = undefined;

    try
    {
        const learningSessionService = new LearningSessionServiceFactory()
            .createNewServiceInstance()
        ;
    
        session = await learningSessionService.createSession(clientId);
        modifiedCount = await learningSessionService.updateSession(
            session.id,
            LearningSessionStates.done
        );
        updatedSession = await learningSessionService.getSession(session.id);

    } catch (error) {
        console.error(error);
        expect(error).toBe(undefined);
    }

    expect(modifiedCount).toEqual(1);
    expect(session.id).toEqual(updatedSession.id);

    expect(session.state).toEqual(LearningSessionStates.init);
    expect(session.clientId).toEqual(clientId);
    
    expect(updatedSession.state).toEqual(LearningSessionStates.done);
    expect(updatedSession.clientId).toEqual(clientId);
});