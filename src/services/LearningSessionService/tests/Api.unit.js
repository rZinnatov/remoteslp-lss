const TestHelper = require('./TestHelper');
const LearningSession = require('../../../domain/LearningSession');
const LearningSessionServiceFactory = require('../index');


test('LearningSessionService API listen on specified port', () => {
    // <-- Prepare -->
    const settingsMock = TestHelper.createSettingsMock();
    settingsMock.api.port = 3333;

    const expressMock = TestHelper.createExpressMock();
    expressMock.listen = (port) => {
        // <-- Check -->
        expect(port).toEqual(settingsMock.api.port);
        // </- Check -->
    };

    const factoryOptions = {
        logger: TestHelper.createLoggerMock(),
        settings: settingsMock
    };
    const api = new LearningSessionServiceFactory(factoryOptions)
        .createNewApiInstance(TestHelper.createServiceMock(), null, expressMock)
    ;
    // </- Prepare -->

    // <-- Run -->
    api.run();
    // </- Run -->
});
test('LearningSessionService API getSession uses "id" url param', async () => {
    // <-- Prepare -->
    const clientId = 'clientId-123';
    const requestMock = { params: { id: 'id-123' } };
    const responseMock = {
        json: (session) => {
            const expectedSession = new LearningSession(
                requestMock.params.id,
                clientId
            );
            // <-- Check -->
            expect(session).toEqual(expectedSession);
            // </- Check -->
        }
    };

    const serviceMock = TestHelper.createServiceMock();
    serviceMock.getSession = async (id) => {
        // <-- Check -->
        expect(id).toEqual(requestMock.params.id);
        // </- Check -->
        return new Promise(resolve => resolve(new LearningSession(requestMock.params.id, clientId)));
    };
    
    const factoryOptions = {
        logger: TestHelper.createLoggerMock(),
        settings: TestHelper.createSettingsMock()
    };
    const api = new LearningSessionServiceFactory(factoryOptions)
        .createNewApiInstance(serviceMock, null, TestHelper.createExpressMock())
    ;
    // </- Prepare -->

    // <-- Run -->
    await api._getSession(requestMock, responseMock);
    // </- Run -->
});
test('LearningSessionService API getSessions uses "clientId" url param', async () => {
    // <-- Prepare -->
    const id1 = 'id-123-1';
    const id2 = 'id-123-2';
    const requestMock = { params: { clientId: 'clientId-123' } };
    const responseMock = {
        json: (sessions) => {
            const expectedSessions = [
                new LearningSession(id1, requestMock.params.clientId),
                new LearningSession(id2, requestMock.params.clientId),
            ];
            // <-- Check -->
            expect(sessions).toEqual(expectedSessions);
            // </- Check -->
        }
    };

    const serviceMock = TestHelper.createServiceMock();
    serviceMock.getSessions = async (clientId) => {
        // <-- Check -->
        expect(clientId).toEqual(requestMock.params.clientId);
        // </- Check -->
        const sessions = [
            new LearningSession(id1, clientId),
            new LearningSession(id2, clientId),
        ];
        return new Promise(resolve => resolve(sessions));
    };
    
    const factoryOptions = {
        logger: TestHelper.createLoggerMock(),
        settings: TestHelper.createSettingsMock()
    };
    const api = new LearningSessionServiceFactory(factoryOptions)
        .createNewApiInstance(serviceMock, null, TestHelper.createExpressMock())
    ;
    // </- Prepare -->

    // <-- Run -->
    await api._getSessions(requestMock, responseMock);
    // </- Run -->
});
test('LearningSessionService API createSession uses "clientId" body param', async () => {
    // <-- Prepare -->
    const id = 'id-123';
    const requestMock = { body: { clientId: 'clientId-123' } };
    const responseMock = {
        json: (session) => {
            const expectedSession = new LearningSession(id, requestMock.body.clientId);
            // <-- Check -->
            expect(session).toEqual(expectedSession);
            // </- Check -->
        }
    };

    const serviceMock = TestHelper.createServiceMock();
    serviceMock.createSession = async (clientId) => {
        // <-- Check -->
        expect(clientId).toEqual(requestMock.body.clientId);
        // </- Check -->
        const session = new LearningSession(id, requestMock.body.clientId);
        return new Promise(resolve => resolve(session));
    };
    
    const factoryOptions = {
        logger: TestHelper.createLoggerMock(),
        settings: TestHelper.createSettingsMock()
    };
    const api = new LearningSessionServiceFactory(factoryOptions)
        .createNewApiInstance(serviceMock, null, TestHelper.createExpressMock())
    ;
    // </- Prepare -->

    // <-- Run -->
    await api._createSession(requestMock, responseMock);
    // </- Run -->
});
test('LearningSessionService API updateSession', () => {
    // <-- Prepare -->
    const requestMock = { body: { id: 'id-123', state: 2 } };
    const responseMock = {
        json: function(result) {
            // <-- Check -->
            const expectedResult = { modifiedCount: 1 };
            expect(result).toEqual(expectedResult);
            // </- Check -->
        }
    };
    const serviceMock = TestHelper.createServiceMock();
    serviceMock.updateSession = async (id, state) => {
        // <-- Check -->
        expect(id).toEqual(requestMock.body.id);
        expect(state).toEqual(requestMock.body.state);
        // </- Check -->
        return new Promise(resolve => resolve(1));
    };

    const factoryOptions = {
        logger: TestHelper.createLoggerMock(),
        settings: TestHelper.createSettingsMock()
    };
    const api = new LearningSessionServiceFactory(factoryOptions)
        .createNewApiInstance(serviceMock, null, TestHelper.createExpressMock())
    ;
    // </- Prepare -->

    // <-- Run -->
    api._updateSession(requestMock, responseMock);
    // </- Run -->
});
test('LearningSessionService API deleteAllSessions', async () => {
    // <-- Prepare -->
    const responseMock = {
        json: (result) => {
            const expectedResult = { deletedCount: 5 };
            // <-- Check -->
            expect(result).toEqual(expectedResult);
            // </- Check -->
        }
    };

    const serviceMock = TestHelper.createServiceMock();
    serviceMock.removeAllSessions = async () => {
        return new Promise(resolve => resolve(5));
    };
    
    const factoryOptions = {
        logger: TestHelper.createLoggerMock(),
        settings: TestHelper.createSettingsMock()
    };
    const api = new LearningSessionServiceFactory(factoryOptions)
        .createNewApiInstance(serviceMock, null, TestHelper.createExpressMock())
    ;
    // </- Prepare -->

    // <-- Run -->
    await api._deleteAllSessions(null, responseMock);
    // </- Run -->
});
test('LearningSessionService API deleteSession uses "id" url param', async () => {
    // <-- Prepare -->
    const requestMock = { params: { id: 'id-123' } };
    const responseMock = {
        json: (result) => {
            const expectedResult = { deletedCount: 1 };
            // <-- Check -->
            expect(result).toEqual(expectedResult);
            // </- Check -->
        }
    };

    const serviceMock = TestHelper.createServiceMock();
    serviceMock.removeSession = async (id) => {
        // <-- Check -->
        expect(id).toEqual(requestMock.params.id);
        // </- Check -->
        return new Promise(resolve => resolve(1));
    };
    
    const factoryOptions = {
        logger: TestHelper.createLoggerMock(),
        settings: TestHelper.createSettingsMock()
    };
    const api = new LearningSessionServiceFactory(factoryOptions)
        .createNewApiInstance(serviceMock, null, TestHelper.createExpressMock())
    ;
    // </- Prepare -->

    // <-- Run -->
    await api._deleteSession(requestMock, responseMock);
    // </- Run -->
});
test('LearningSessionService API deleteSessions uses "clientId" url param', async () => {
    // <-- Prepare -->
    const requestMock = { params: { clientId: 'clientId-123' } };
    const responseMock = {
        json: (result) => {
            const expectedResult = { deletedCount: 5 };
            // <-- Check -->
            expect(result).toEqual(expectedResult);
            // </- Check -->
        }
    };

    const serviceMock = TestHelper.createServiceMock();
    serviceMock.removeSessions = async (clientId) => {
        // <-- Check -->
        expect(clientId).toEqual(requestMock.params.clientId);
        // </- Check -->
        return new Promise(resolve => resolve(5));
    };
    
    const factoryOptions = {
        logger: TestHelper.createLoggerMock(),
        settings: TestHelper.createSettingsMock()
    };
    const api = new LearningSessionServiceFactory(factoryOptions)
        .createNewApiInstance(serviceMock, null, TestHelper.createExpressMock())
    ;
    // </- Prepare -->

    // <-- Run -->
    await api._deleteSessions(requestMock, responseMock);
    // </- Run -->
});
test('LearningSessionService API does not catches errors while stopping', async () => {
    const learningSessionServiceMock = TestHelper.createServiceMock();
    learningSessionServiceMock.stop = () =>
        new Promise(_ => { throw new Error(); })
    ;
    const factoryOptions = {
        logger: TestHelper.createLoggerMock()
    };
    const api = new LearningSessionServiceFactory(factoryOptions)
        .createNewApiInstance(learningSessionServiceMock)
    ;

    await expect(api.stop()).rejects.toThrow();
});