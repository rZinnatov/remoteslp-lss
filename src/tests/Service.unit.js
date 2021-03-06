const TestHelper = require('./TestHelper');
const LearningSession = require('../lib/domain/entities/LearningSession');
const LearningSessionStates = require('../lib/domain/entities/LearningSessionStates');
const LearningSessionServiceFactory = require('../index.js');


const fakeId = 'fakeId-123';
const fakeuserId = 'fakeuserId-123';
const fakeState = 123;
const factoryOptions = {
    logger: TestHelper.createLoggerMock(),
    settings: {}
};

test('LearningSessionService.getSession returns a valid session', async () => {
    // <-- Prepare -->
    const fakeSession = { _id: fakeId, userId: fakeuserId, state: fakeState };
    const storageMock = { sessions: {
        selectById: () => new Promise(resolve => resolve(fakeSession))
    }};
    const learningSessionService = await new LearningSessionServiceFactory(factoryOptions)
        .createService(storageMock)
    ;
    // </- Prepare -->
    
    // <-- Run -->
    const session = await learningSessionService.getSession(fakeId);
    // </- Run -->

    // <-- Check -->
    expect(session).toEqual(new LearningSession(fakeId, fakeuserId, fakeState));
    // </- Check -->
});
test('LearningSessionService.getSessions returns a valid sessions', async () => {
    // <-- Prepare -->
    const fakeSession = { _id: fakeId, userId: fakeuserId, state: fakeState };
    const fakeSessions = [fakeSession, fakeSession, fakeSession];
    const storageMock = { sessions: {
        where: () => new Promise(resolve => resolve(fakeSessions))
    }};
    const learningSessionService = await new LearningSessionServiceFactory(factoryOptions)
        .createService(storageMock)
    ;
    // </- Prepare -->
    
    // <-- Run -->
    const sessions = await learningSessionService.getSessions(fakeuserId);
    // </- Run -->

    // <-- Check -->
    sessions.forEach(session => expect(session.userId).toEqual(fakeuserId));
    // </- Check -->
});
test('LearningSessionService.createSession returns a valid session', async () => {
    // <-- Prepare -->
    const fakeItem = { _id: fakeId, userId: fakeuserId, state: LearningSessionStates.init };
    const storageMock = { sessions: {
        insert: () => new Promise(resolve => resolve(fakeItem))
    }};
    const learningSessionService = await new LearningSessionServiceFactory(factoryOptions)
        .createService(storageMock)
    ;
    // </- Prepare -->
    
    // <-- Run -->
    const session = await learningSessionService.createSession(fakeuserId);
    // </- Run -->

    // <-- Check -->
    expect(session).toEqual(new LearningSession(fakeId, fakeuserId));
    // </- Check -->
});