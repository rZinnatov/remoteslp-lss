const express = require('express');
const bodyParser = require('body-parser');


module.exports = class Api {
    constructor(settings, service, api) {
        this._settings = settings;
        this._service = service;

        this._expressApp = api || express();
        this._expressApp.use(bodyParser.json());
        this._expressApp.use((request, response, next) => {
            response.setHeader('Content-Type', 'application/json; charset=utf8');
            next();
        });

        const apiPath = this._settings.apiPath;
        this._expressApp.get(`${apiPath}/session/:id`, this._getSession.bind(this));
        this._expressApp.get(`${apiPath}/sessions/:clientId`, this._getSessions.bind(this));
        this._expressApp.put(`${apiPath}/session/`, this._createSession.bind(this));
        this._expressApp.post(`${apiPath}/session/`, this._updateSession.bind(this));
        this._expressApp.delete(`${apiPath}/session/:id`, this._deleteSession.bind(this));
        this._expressApp.delete(`${apiPath}/sessions/`, this._deleteAllSessions.bind(this));
        this._expressApp.delete(`${apiPath}/sessions/:clientId`, this._deleteSessions.bind(this));
    }

    run() {
        this._expressApp.listen(
            this._settings.port,
            () => console.log(`listening on port ${this._settings.port}`)
        );
    }

    
    async _getSession(request, response) {
        try {
            const session = await this._service.getSession(request.params.id);
            response.send(JSON.stringify(session));

        } catch(error) {
            this._processError(error, response);
        }
    }
    async _getSessions(request, response) {
        try {
            const sessions = await this._service.getSessions(request.params.clientId);
            response.send(JSON.stringify(sessions));

        } catch(error) {
            this._processError(error, response);
        }
    }
    async _createSession(request, response) {
        // TODO: Validate body
        
        try {
            const session = await this._service.createSession(request.body.clientId);
            response.send(JSON.stringify(session));

        } catch(error) {
            this._processError(error, response);
        }
    }
    async _updateSession(request, response) {
        try {
            const modifiedCount = await this._service.updateSession(
                request.body.id,
                request.body.state,
            );
            response.send(JSON.stringify({ modifiedCount: modifiedCount }));

        } catch(error) {
            this._processError(error, response);
        }
    }
    async _deleteAllSessions(request, response) {
        try {
            const deletedCount = await this._service.removeAll();
            response.send(JSON.stringify({ deletedCount: deletedCount }));

        } catch(error) {
            this._processError(error, response);
        }
    }
    async _deleteSession(request, response) {
        try {
            const deletedCount = await this._service.removeSession(request.params.id);
            response.send(JSON.stringify({ deletedCount: deletedCount }));

        } catch(error) {
            this._processError(error, response);
        }
    }
    async _deleteSessions(request, response) {
        try {
            const deletedCount = await this._service.removeSessions(request.params.clientId);
            response.send(JSON.stringify({ deletedCount: deletedCount }));

        } catch(error) {
            this._processError(error, response);
        }
    }
    _processError(error, response) {
        // TODO: Log the error

        response.statusCode = 500;
        response.send(JSON.stringify({ error: error.message }));
    }
};