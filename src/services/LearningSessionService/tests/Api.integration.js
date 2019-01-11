const express = require('express');
const request = require('supertest');

const TestHelper = require('./TestHelper');
const LearningSession = require('../../../domain/LearningSession');
const LearningSessionStates = require('../../../domain/LearningSessionStates');
const LearningSessionServiceFactory = require('../index');


let apiPath;
let sessionId;
let expressApp;
let learningSessionService;
const clientId = 'clientId-123';
const anotherClientId = 'anotherClientId-123';
beforeAll(async () => {
    const factory = new LearningSessionServiceFactory({ logger: TestHelper.createLoggerMock() });
    apiPath = factory.settings.api.path;

    learningSessionService = factory.createNewServiceInstance();
    await learningSessionService.removeSessions(clientId);
    await learningSessionService.removeSessions(anotherClientId);

    expressApp = express();
    factory.createNewApiInstance(
        learningSessionService,
        null,
        expressApp
    );
});
beforeEach(async () => {
    const session = await learningSessionService.createSession(clientId);
    sessionId = session.id;
    await learningSessionService.createSession(clientId);
    await learningSessionService.createSession(clientId);
    await learningSessionService.createSession(anotherClientId);
});
afterEach(async () => {
    await learningSessionService.removeSessions(clientId);
    await learningSessionService.removeSessions(anotherClientId);
});

test(`LearningSessionService API GET /session returns session by id`, async () => {
    const response = await request(expressApp)
        .get(`${apiPath}/session/${sessionId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Content-Type', /utf-8/)
    ;
    
    const actualResponse = JSON.stringify(response.body);
    const expectedResponse = JSON.stringify(new LearningSession(sessionId, clientId));
    expect(actualResponse).toEqual(expectedResponse);
});
test(`LearningSessionService API GET /session returns 404 if session does not exist`, async () => {
    await request(expressApp)
        .get(`${apiPath}/session/not-existing`)
        .expect(404)
    ;
});
test(`LearningSessionService API GET /sessions returns session of a client`, async () => {
    const response = await request(expressApp)
        .get(`${apiPath}/sessions/${clientId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Content-Type', /utf-8/)
    ;
    
    expect(response.body.length).toEqual(3);
    response.body.map(s => expect(s.clientId).toEqual(clientId));
});
test(`LearningSessionService API GET /sessions returns empty array if there was no match`, async () => {
    const response = await request(expressApp)
        .get(`${apiPath}/sessions/not-existing`)
        .expect(200)
    ;

    expect(response.body).toEqual([]);
});
test(`LearningSessionService API PUT /session creates new session`, async () => {
    // <-- Create Session -->
    const createResponse = await request(expressApp)
        .put(`${apiPath}/session`)
        .send({ clientId: clientId })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Content-Type', /utf-8/)
    ;
    
    const newSessionId = createResponse.body.id;
    expect(typeof newSessionId).toEqual('string');
    expect(createResponse.body.clientId).toEqual(clientId);
    expect(createResponse.body.state).toEqual(LearningSessionStates.init);
    // </- Create Session -->

    // <-- Get Session -->
    const getResponse = await request(expressApp)
        .get(`${apiPath}/session/${newSessionId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Content-Type', /utf-8/)
    ;

    const actualResponse = JSON.stringify(getResponse.body);
    const expectedResponse = JSON.stringify(new LearningSession(newSessionId, clientId));
    expect(actualResponse).toEqual(expectedResponse);
    // </- Get Session -->
});
test(`LearningSessionService API POST /session updates session`, async () => {
    // <-- Update Session -->
    const updateResponse = await request(expressApp)
        .post(`${apiPath}/session`)
        .send({ id: sessionId, state: LearningSessionStates.done })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Content-Type', /utf-8/)
    ;
    
    expect(updateResponse.body).toEqual({ modifiedCount: 1 });
    // </- Update Session -->
    

    // <-- Get Session -->
    const getResponse = await request(expressApp)
        .get(`${apiPath}/session/${sessionId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Content-Type', /utf-8/)
    ;

    const actualResponse = JSON.stringify(getResponse.body);
    const expectedResponse = JSON.stringify(new LearningSession(sessionId, clientId, LearningSessionStates.done));
    expect(actualResponse).toEqual(expectedResponse);
    // </- Get Session -->
});
test(`LearningSessionService API DELETE /sessions`, async () => {
    // <-- Delete Session -->
    const deleteResponse = await request(expressApp)
        .delete(`${apiPath}/sessions`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Content-Type', /utf-8/)
    ;
    
    expect(deleteResponse.body).toEqual({ deletedCount: 4 });
    // </- Delete Session -->
    
    // <-- Delete Session -->
    const doubleDeleteResponse = await request(expressApp)
        .delete(`${apiPath}/sessions`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Content-Type', /utf-8/)
    ;
    
    expect(doubleDeleteResponse.body).toEqual({ deletedCount: 0 });
    // </- Delete Session -->
    
    // <-- Get Session -->
    await request(expressApp)
        .get(`${apiPath}/session/${sessionId}`)
        .expect(404)
    ;
    // </- Get Session -->
        
    // <-- Get Session -->
    const getResponse = await request(expressApp)
        .get(`${apiPath}/sessions/${clientId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Content-Type', /utf-8/)
    ;

    expect(getResponse.body).toEqual([]);
    // </- Get Session -->
});
test(`LearningSessionService API DELETE /session deletes session by id`, async () => {
    // <-- Delete Session -->
    const deleteResponse = await request(expressApp)
        .delete(`${apiPath}/session/${sessionId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Content-Type', /utf-8/)
    ;
    
    expect(deleteResponse.body).toEqual({ deletedCount: 1 });
    // </- Delete Session -->
    
    // <-- Get Session -->
    await request(expressApp)
        .get(`${apiPath}/session/${sessionId}`)
        .expect(404)
    ;
    // </- Get Session -->
    
    // <-- Get Session -->
    const getResponse = await request(expressApp)
        .get(`${apiPath}/sessions/${clientId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Content-Type', /utf-8/)
    ;

    expect(getResponse.body.length).toEqual(2);
    // </- Get Session -->
    
    // <-- Delete Session -->
    const doubleDeleteResponse = await request(expressApp)
        .delete(`${apiPath}/sessions`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Content-Type', /utf-8/)
    ;
    
    expect(doubleDeleteResponse.body).toEqual({ deletedCount: 3 });
    // </- Delete Session -->
});
test(`LearningSessionService API DELETE /sessions deletes all sessions of a client`, async () => {
    // <-- Delete Session -->
    const deleteResponse = await request(expressApp)
        .delete(`${apiPath}/sessions/${clientId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Content-Type', /utf-8/)
    ;
    
    expect(deleteResponse.body).toEqual({ deletedCount: 3 });
    // </- Delete Session -->
    
    // <-- Get Session -->
    await request(expressApp)
        .get(`${apiPath}/session/${sessionId}`)
        .expect(404)
    ;
    // </- Get Session -->
        
    // <-- Get Session -->
    const getResponse = await request(expressApp)
        .get(`${apiPath}/sessions/${clientId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Content-Type', /utf-8/)
    ;

    expect(getResponse.body).toEqual([]);
    // </- Get Session -->
    
    // <-- Delete Session -->
    const doubleDeleteResponse = await request(expressApp)
        .delete(`${apiPath}/sessions`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Content-Type', /utf-8/)
    ;

    expect(doubleDeleteResponse.body).toEqual({ deletedCount: 1 });
    // </- Delete Session -->
});
test(`LearningSessionService API catches all error`, async () => {
    const factory = new LearningSessionServiceFactory({ logger: TestHelper.createLoggerMock() });
    apiPath = factory.settings.api.path;

    const errorMessage = 'errorMessage';
    const learningSessionServiceMock = TestHelper.createServiceMock(
        () => new Promise(_ => { throw new Error(errorMessage); })
    );

    const expressApp = express();
    const api = factory.createNewApiInstance(
        learningSessionServiceMock,
        null,
        expressApp
    );

    // <-- FUCKING HACK -->
    // It is needed to call api.run() to set custom error handler
    // But it is not needed to express to actually start listening
    const originalListenMethod = expressApp.listen;
    expressApp.listen = () => {};
    api.run();
    expressApp.listen = originalListenMethod;
    // </- FUCKING HACK -->

    const requests = [
        request(expressApp).get(`${apiPath}/session/${sessionId}`),
        request(expressApp).get(`${apiPath}/sessions/${clientId}`),
        request(expressApp).put(`${apiPath}/session`),
        request(expressApp).post(`${apiPath}/session`),
        request(expressApp).delete(`${apiPath}/sessions`),
        request(expressApp).delete(`${apiPath}/session/${sessionId}`),
        request(expressApp).delete(`${apiPath}/sessions/${clientId}`)
    ];

    requests.forEach(async (request) => {
        const response = await request
            .expect(500)
            .expect('Content-Type', /json/)
            .expect('Content-Type', /utf-8/)
        ;
        expect(response.body).toEqual({ error: errorMessage });
    });
});