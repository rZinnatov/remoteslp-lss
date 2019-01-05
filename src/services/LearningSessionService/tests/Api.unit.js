const LearningSession = require('../../../domain/LearningSession');
const LearningSessionServiceFactory = require('../index');


function createSettingsMock() {
    return {
        api: {
            port: 3000,
            apiPath: ''
        },
        storage: {
            url: '',
            dbName: '',
            collectionName: ''
        }
    };
}
function createExpressMock(methodMock = () => {}) {
    return {
        use: methodMock,
        get: methodMock,
        put: methodMock,
        post: methodMock,
        delete: methodMock,
        listen: methodMock
    };
}
function createServiceMock(methodMock = async () => new Promise(resolve => resolve())) {
    return {
        getSession: methodMock,
        getSessions: methodMock,
        createSession: methodMock,
        removeAll: methodMock,
        removeSession: methodMock,
        removeSessions: methodMock
    };
}


test('LearningSessionService API listen on specified port', () => {
    // <-- Prepare -->
    const settingsMock = createSettingsMock();
    settingsMock.api.port = 3333;

    const expressMock = createExpressMock();
    expressMock.listen = (port) => {
        // <-- Check -->
        expect(port).toEqual(settingsMock.api.port);
        // </- Check -->
    };

    const learningSessionServiceApi = new LearningSessionServiceFactory(settingsMock)
        .createNewApiInstance(createServiceMock(), expressMock)
    ;
    // </- Prepare -->

    // <-- Run -->
    learningSessionServiceApi.run();
    // </- Run -->
});
test('LearningSessionService API getSession uses "id" url param', async () => {
    // <-- Prepare -->
    const clientId = 'clientId-123';
    const requestMock = { params: { id: 'id-123' } };
    const responseMock = {
        send: (session) => {
            const expectedSession = new LearningSession(
                requestMock.params.id,
                clientId
            );
            // <-- Check -->
            expect(session).toEqual(JSON.stringify(expectedSession));
            // </- Check -->
        }
    };

    const serviceMock = createServiceMock();
    serviceMock.getSession = async (id) => {
        // <-- Check -->
        expect(id).toEqual(requestMock.params.id);
        // </- Check -->
        return new Promise(resolve => resolve(new LearningSession(requestMock.params.id, clientId)));
    };
    
    const learningSessionServiceApi = new LearningSessionServiceFactory(createSettingsMock())
        .createNewApiInstance(serviceMock, createExpressMock())
    ;
    // </- Prepare -->

    // <-- Run -->
    await learningSessionServiceApi._getSession(requestMock, responseMock);
    // </- Run -->
});
test('LearningSessionService API getSessions uses "clientId" url param', async () => {
    // <-- Prepare -->
    const id1 = 'id-123-1';
    const id2 = 'id-123-2';
    const requestMock = { params: { clientId: 'clientId-123' } };
    const responseMock = {
        send: (sessions) => {
            const expectedSessions = [
                new LearningSession(id1, requestMock.params.clientId),
                new LearningSession(id2, requestMock.params.clientId),
            ];
            // <-- Check -->
            expect(sessions).toEqual(JSON.stringify(expectedSessions));
            // </- Check -->
        }
    };

    const serviceMock = createServiceMock();
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
    
    const learningSessionServiceApi = new LearningSessionServiceFactory(createSettingsMock())
        .createNewApiInstance(serviceMock, createExpressMock())
    ;
    // </- Prepare -->

    // <-- Run -->
    await learningSessionServiceApi._getSessions(requestMock, responseMock);
    // </- Run -->
});
test('LearningSessionService API createSession uses "clientId" body param', async () => {
    // <-- Prepare -->
    const id = 'id-123';
    const requestMock = { body: { clientId: 'clientId-123' } };
    const responseMock = {
        send: (session) => {
            const expectedSession = new LearningSession(id, requestMock.body.clientId);
            // <-- Check -->
            expect(session).toEqual(JSON.stringify(expectedSession));
            // </- Check -->
        }
    };

    const serviceMock = createServiceMock();
    serviceMock.createSession = async (clientId) => {
        // <-- Check -->
        expect(clientId).toEqual(requestMock.body.clientId);
        // </- Check -->
        const session = new LearningSession(id, requestMock.body.clientId);
        return new Promise(resolve => resolve(session));
    };
    
    const learningSessionServiceApi = new LearningSessionServiceFactory(createSettingsMock())
        .createNewApiInstance(serviceMock, createExpressMock())
    ;
    // </- Prepare -->

    // <-- Run -->
    await learningSessionServiceApi._createSession(requestMock, responseMock);
    // </- Run -->
});
test('LearningSessionService API updateSession', () => {
    // <-- Prepare -->
    const requestMock = { body: { id: 'id-123', state: 2 } };
    const responseMock = {
        send: function(result) {
            // <-- Check -->
            const expectedResult = { modifiedCount: 1 };
            expect(result).toEqual(JSON.stringify(expectedResult));
            // </- Check -->
        }
    };
    const serviceMock = createServiceMock();
    serviceMock.updateSession = async (id, state) => {
        // <-- Check -->
        expect(id).toEqual(requestMock.body.id);
        expect(state).toEqual(requestMock.body.state);
        // </- Check -->
        return new Promise(resolve => resolve(1));
    };
    const learningSessionServiceApi = new LearningSessionServiceFactory(createSettingsMock())
        .createNewApiInstance(serviceMock, createExpressMock())
    ;
    // </- Prepare -->

    // <-- Run -->
    learningSessionServiceApi._updateSession(requestMock, responseMock);
    // </- Run -->
});
test('LearningSessionService API deleteAllSessions', async () => {
    // <-- Prepare -->
    const responseMock = {
        send: (result) => {
            const expectedResult = { deletedCount: 5 };
            // <-- Check -->
            expect(result).toEqual(JSON.stringify(expectedResult));
            // </- Check -->
        }
    };

    const serviceMock = createServiceMock();
    serviceMock.removeAll = async () => {
        return new Promise(resolve => resolve(5));
    };
    
    const learningSessionServiceApi = new LearningSessionServiceFactory(createSettingsMock())
        .createNewApiInstance(serviceMock, createExpressMock())
    ;
    // </- Prepare -->

    // <-- Run -->
    await learningSessionServiceApi._deleteAllSessions(null, responseMock);
    // </- Run -->
});
test('LearningSessionService API deleteSession uses "id" url param', async () => {
    // <-- Prepare -->
    const requestMock = { params: { id: 'id-123' } };
    const responseMock = {
        send: (result) => {
            const expectedResult = { deletedCount: 1 };
            // <-- Check -->
            expect(result).toEqual(JSON.stringify(expectedResult));
            // </- Check -->
        }
    };

    const serviceMock = createServiceMock();
    serviceMock.removeSession = async (id) => {
        // <-- Check -->
        expect(id).toEqual(requestMock.params.id);
        // </- Check -->
        return new Promise(resolve => resolve(1));
    };
    
    const learningSessionServiceApi = new LearningSessionServiceFactory(createSettingsMock())
        .createNewApiInstance(serviceMock, createExpressMock())
    ;
    // </- Prepare -->

    // <-- Run -->
    await learningSessionServiceApi._deleteSession(requestMock, responseMock);
    // </- Run -->
});
test('LearningSessionService API deleteSessions uses "clientId" url param', async () => {
    // <-- Prepare -->
    const requestMock = { params: { clientId: 'clientId-123' } };
    const responseMock = {
        send: (result) => {
            const expectedResult = { deletedCount: 5 };
            // <-- Check -->
            expect(result).toEqual(JSON.stringify(expectedResult));
            // </- Check -->
        }
    };

    const serviceMock = createServiceMock();
    serviceMock.removeSessions = async (clientId) => {
        // <-- Check -->
        expect(clientId).toEqual(requestMock.params.clientId);
        // </- Check -->
        return new Promise(resolve => resolve(5));
    };
    
    const learningSessionServiceApi = new LearningSessionServiceFactory(createSettingsMock())
        .createNewApiInstance(serviceMock, createExpressMock())
    ;
    // </- Prepare -->

    // <-- Run -->
    await learningSessionServiceApi._deleteSessions(requestMock, responseMock);
    // </- Run -->
});
test('LearningSessionService API catches errors', async () => {
    // <-- Prepare -->
    const errorMessage = 'errorMessage';
    const requestMock = {
        params: { id: 'id-123', clientId: 'clientId-123' },
        body: { clientId: 'clientId-123' }
    };
    const responseMock = {
        statusCode: 0,
        send: function(error) {
            // <-- Check -->
            expect(error).toEqual(JSON.stringify({ error: errorMessage }));
            expect(this.statusCode).toEqual(500);
            // </- Check -->
        }
    };
    const serviceMock = createServiceMock(async () => {
        return new Promise(_ => { throw new Error(errorMessage); });
    });
    const learningSessionServiceApi = new LearningSessionServiceFactory(createSettingsMock())
        .createNewApiInstance(serviceMock, createExpressMock())
    ;
    // </- Prepare -->

    // <-- Run -->
    // TODO: Make separate unit test for each call
    await learningSessionServiceApi._getSession(requestMock, responseMock);
    await learningSessionServiceApi._getSessions(requestMock, responseMock);
    await learningSessionServiceApi._createSession(requestMock, responseMock);
    await learningSessionServiceApi._deleteAllSessions(requestMock, responseMock);
    await learningSessionServiceApi._deleteSession(requestMock, responseMock);
    await learningSessionServiceApi._deleteSessions(requestMock, responseMock);
    // </- Run -->
});