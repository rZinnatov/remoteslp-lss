const LearningSession = require('../../../domain/LearningSession');
const LearningSessionStates = require('../../../domain/LearningSessionStates');
const LearningSessionServiceFactory = require('../index.js');


const fakeId = 'fakeId-123';
const fakeClientId = 'fakeClientId-123';
const fakeState = 123;


test('LearningSessionService.getSession returns a valid session', async (done) => {
    // <-- Prepare -->
    const fakeSession = { _id: fakeId, clientId: fakeClientId, state: fakeState };
    const storageMock = {
        selectById: () => new Promise(resolve => resolve(fakeSession))
    };
    const learningSessionService = new LearningSessionServiceFactory({})
        .createNewServiceInstance(storageMock)
    ;
    // </- Prepare -->
    
    // <-- Run -->
    const session = await learningSessionService.getSession(fakeId);
    // </- Run -->

    // <-- Check -->
    expect(session).toEqual(new LearningSession(fakeId, fakeClientId, fakeState));
    // </- Check -->

    done();
});
test('LearningSessionService.getSessions returns a valid sessions', async (done) => {
    // <-- Prepare -->
    const fakeSession = { _id: fakeId, clientId: fakeClientId, state: fakeState };
    const fakeSessions = [fakeSession, fakeSession, fakeSession];
    const storageMock = {
        where: () => new Promise(resolve => resolve(fakeSessions))
    };
    const learningSessionService = new LearningSessionServiceFactory({})
        .createNewServiceInstance(storageMock)
    ;
    // </- Prepare -->
    
    // <-- Run -->
    const sessions = await learningSessionService.getSessions(fakeClientId);
    // </- Run -->

    // <-- Check -->
    sessions.forEach(session => expect(session.clientId).toEqual(fakeClientId));
    // </- Check -->

    done();
});
test('LearningSessionService.createSession returns a valid session', async (done) => {
    // <-- Prepare -->
    const fakeItem = { _id: fakeId, clientId: fakeClientId, state: LearningSessionStates.init };
    const storageMock = {
        insert: () => new Promise(resolve => resolve(fakeItem))
    };
    const learningSessionService = new LearningSessionServiceFactory({})
        .createNewServiceInstance(storageMock)
    ;
    // </- Prepare -->
    
    // <-- Run -->
    const session = await learningSessionService.createSession(fakeClientId);
    // </- Run -->

    // <-- Check -->
    expect(session).toEqual(new LearningSession(fakeId, fakeClientId));
    // </- Check -->

    done();
});