const TestHelper = require('./TestHelper');
const LearningSessionStates = require('../lib/domain/entities/LearningSessionStates');
const LearningSessionServiceFactory = require('../index.js');


const userId = 'user-123';
const anotheruserId = 'another-user-123';
const factoryOptions = {
    logger: TestHelper.createLoggerMock()
};

beforeEach(async () => {
    const learningSessionService = await new LearningSessionServiceFactory(factoryOptions)
        .createService()
    ;
    await learningSessionService.removeSessions(userId);
    await learningSessionService.removeSessions(anotheruserId);
});
afterAll(async () => {
    const learningSessionService = await new LearningSessionServiceFactory(factoryOptions)
        .createService()
    ;
    await learningSessionService.removeSessions(userId);
    await learningSessionService.removeSessions(anotheruserId);
});

test('LearningSessionService can select newly registered session', async () => {
    let registeredSession = undefined;
    let selectedSession = undefined;

    try
    {
        const learningSessionService = await new LearningSessionServiceFactory(factoryOptions)
            .createService()
        ;
    
        registeredSession = await learningSessionService.createSession(userId);
        selectedSession = await learningSessionService.getSession(registeredSession.id);

    } catch (error) {
        expect(error).toBe(undefined);
    }

    expect(selectedSession).toEqual(registeredSession);
});
test('LearningSessionService can select list of sessions of a user', async () => {
    let learningSessions = undefined;
    try
    {
        const learningSessionService = await new LearningSessionServiceFactory(factoryOptions)
            .createService()
        ;
    
        await learningSessionService.createSession(userId);
        await learningSessionService.createSession(userId);
        await learningSessionService.createSession(userId);
        await learningSessionService.createSession(anotheruserId);
        
        learningSessions = await learningSessionService.getSessions(userId);

    } catch (error) {
        expect(error).toBe(undefined);
    }
    
    expect(learningSessions.length).toEqual(3);
    learningSessions.forEach(session => expect(session.userId).toEqual(userId));
});
test('LearningSessionService can update session', async () => {
    let session = undefined;
    let modifiedCount = undefined;
    let updatedSession = undefined;

    try
    {
        const learningSessionService = await new LearningSessionServiceFactory(factoryOptions)
            .createService()
        ;
    
        session = await learningSessionService.createSession(userId);
        modifiedCount = await learningSessionService.updateSession(
            session.id,
            LearningSessionStates.done
        );
        updatedSession = await learningSessionService.getSession(session.id);

    } catch (error) {
        expect(error).toBe(undefined);
    }

    expect(modifiedCount).toEqual(1);
    expect(session.id).toEqual(updatedSession.id);

    expect(session.state).toEqual(LearningSessionStates.init);
    expect(session.userId).toEqual(userId);
    
    expect(updatedSession.state).toEqual(LearningSessionStates.done);
    expect(updatedSession.userId).toEqual(userId);
});