const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require("standard-http-error");


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
        this._expressApp.use(this._sendError);

        const apiPath = this._settings.path;
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

    
    async _getSession(request, response, next) {
        try {
            const session = await this._service.getSession(request.params.id);
            if (session == undefined) {
                throw new HttpError(HttpError.NOT_FOUND, `session with id '${request.params.id}' not found`);
            }

            response.json(session);

        } catch(error) {
            next(error);
        }
    }
    async _getSessions(request, response, next) {
        try {
            const sessions = await this._service.getSessions(request.params.clientId);
            response.json(sessions);

        } catch(error) {
            next(error);
        }
    }
    async _createSession(request, response, next) {
        // TODO: Validate body
        
        try {
            const session = await this._service.createSession(request.body.clientId);
            response.json(session);

        } catch(error) {
            next(error);
        }
    }
    async _updateSession(request, response, next) {
        try {
            const modifiedCount = await this._service.updateSession(
                request.body.id,
                request.body.state,
            );
            response.json({ modifiedCount: modifiedCount });

        } catch(error) {
            next(error);
        }
    }
    async _deleteAllSessions(request, response, next) {
        try {
            const deletedCount = await this._service.removeAllSessions();
            response.json({ deletedCount: deletedCount });

        } catch(error) {
            next(error);
        }
    }
    async _deleteSession(request, response, next) {
        try {
            const deletedCount = await this._service.removeSession(request.params.id);
            response.json({ deletedCount: deletedCount });

        } catch(error) {
            next(error);
        }
    }
    async _deleteSessions(request, response, next) {
        try {
            const deletedCount = await this._service.removeSessions(request.params.clientId);
            response.json({ deletedCount: deletedCount });

        } catch(error) {
            next(error);
        }
    }
    _sendError(error, request, response, next) {
        response
            .status(error.code || 500)
            .json({ error: error.message })
        ;
    }
};