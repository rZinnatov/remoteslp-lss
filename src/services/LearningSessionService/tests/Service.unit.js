const LearningSession = require('../../../domain/LearningSession');
const LearningSessionStates = require('../../../domain/LearningSessionStates');
const LearningSessionService = require('./../lib/Service');


test('LearningSessionService ctor does not require storage', () => {
    expect(() => new LearningSessionService()).not.toThrow();

    const learningSessionService = new LearningSessionService();
    expect(learningSessionService).toHaveProperty('storage');
    expect(typeof learningSessionService.storage).toBe('object');
    expect(learningSessionService.storage).not.toBe(null);
});
test('LearningSessionService ctor requires storage to be an object', () => {
    expect(() => new LearningSessionService(123)).toThrow(TypeError);
    expect(() => new LearningSessionService('123')).toThrow(TypeError);
    expect(() => new LearningSessionService(Symbol())).toThrow(TypeError);
    expect(() => new LearningSessionService(true)).toThrow(TypeError);

    expect(() => new LearningSessionService({})).not.toThrow(TypeError);
});
test('LearningSessionService.getSession returns a valid session', async () => {
    // <-- Prepare -->
    const fakeId = '123-fakeId-456';
    const fakeClientId = '123-fakeClientId-456';
    const fakeState = 123;
    const fakeSession = { _id: fakeId, clientId: fakeClientId, state: fakeState };
    const storageMock = {
        selectById: () => new Promise(resolve => resolve(fakeSession))
    };
    const learningSessionService = new LearningSessionService(storageMock);
    // </- Prepare -->
    
    // <-- Run -->
    const session = await learningSessionService.getSession(fakeId);
    // </- Run -->

    // <-- Check -->
    expect(session).toEqual(new LearningSession(fakeId, fakeClientId, fakeState));
    // </- Check -->
});
test('LearningSessionService.getSessions returns a valid sessions', async () => {
    // <-- Prepare -->
    const fakeId = '123-fakeId-456';
    const fakeClientId = '123-fakeClientId-456';
    const fakeState = 123;
    const fakeSession = { _id: fakeId, clientId: fakeClientId, state: fakeState };
    const fakeSessions = [fakeSession, fakeSession, fakeSession];
    const storageMock = {
        where: () => new Promise(resolve => resolve(fakeSessions))
    };
    const learningSessionService = new LearningSessionService(storageMock);
    // </- Prepare -->
    
    // <-- Run -->
    const sessions = await learningSessionService.getSessions(fakeClientId);
    // </- Run -->

    // <-- Check -->
    sessions.forEach(session => expect(session.clientId).toEqual(fakeClientId));
    // </- Check -->
});
test('LearningSessionService.registerNew returns a valid session', async () => {
    // <-- Prepare -->
    const fakeId = '123-fakeId-456';
    const fakeClientId = '123-fakeClientId-456';
    const fakeItem = { _id: fakeId, clientId: fakeClientId, state: LearningSessionStates.init };
    const storageMock = {
        insert: () => new Promise(resolve => resolve(fakeItem))
    };
    const learningSessionService = new LearningSessionService(storageMock);
    // </- Prepare -->
    
    // <-- Run -->
    const session = await learningSessionService.registerNew(fakeClientId);
    // </- Run -->

    // <-- Check -->
    expect(session).toEqual(new LearningSession(fakeId, fakeClientId));
    // </- Check -->
});