const HttpError = require('standard-http-error');


module.exports = class RestApi {
    constructor(service, apiDriver) {
        this._service = service;

        this._apiDriver = apiDriver;
        this._apiDriver.get('/session/:id', this._getSession.bind(this));
        this._apiDriver.get('/sessions/:userId', this._getSessions.bind(this));
        this._apiDriver.put('/session/', this._updateSession.bind(this));
        this._apiDriver.post('/session/', this._createSession.bind(this));
        this._apiDriver.delete('/session/:id', this._deleteSession.bind(this));
        this._apiDriver.delete('/sessions/', this._deleteAllSessions.bind(this));
        this._apiDriver.delete('/sessions/:userId', this._deleteSessions.bind(this));
    }

    run() {
        this._apiDriver.run();
    }
    async stop() {
        await this._apiDriver.stop();
        await this._service.stop();
    }

    async _getSession(request, response) {
        const session = await this._service.getSession(request.params.id);
        if (session == undefined) {
            throw new HttpError(HttpError.NOT_FOUND, `session with id '${request.params.id}' not found`);
        }

        response.json(session);
    }
    async _getSessions(request, response) {
        const sessions = await this._service.getSessions(request.params.userId);
        response.json(sessions);
    }
    async _createSession(request, response) {
        // TODO: Validate body

        const session = await this._service.createSession(request.body.userId);
        response.json(session);
    }
    async _updateSession(request, response) {
        const modifiedCount = await this._service.updateSession(
            request.body.id,
            request.body.state,
        );
        response.json({ modifiedCount: modifiedCount });
    }
    async _deleteAllSessions(request, response) {
        const deletedCount = await this._service.removeAllSessions();
        response.json({ deletedCount: deletedCount });
    }
    async _deleteSession(request, response) {
        const deletedCount = await this._service.removeSession(request.params.id);
        response.json({ deletedCount: deletedCount });
    }
    async _deleteSessions(request, response) {
        const deletedCount = await this._service.removeSessions(request.params.userId);
        response.json({ deletedCount: deletedCount });
    }
};