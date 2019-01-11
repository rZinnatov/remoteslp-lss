const express = require('express');
const bodyParser = require('body-parser');


module.exports = class ExpressJsDriver {
    constructor(settings, logger, app) {
        this._settings = settings;
        this._logger = logger;
        this._httpServer = undefined;

        this._app = app || express();
        this._app.use(bodyParser.json());
    }

    get(path, handler) {
        this._app.get(`${this._settings.path}${path}`, this._asyncHandler(handler));
    }
    put(path, handler) {
        this._app.put(`${this._settings.path}${path}`, this._asyncHandler(handler));
    }
    post(path, handler) {
        this._app.post(`${this._settings.path}${path}`, this._asyncHandler(handler));
    }
    delete(path, handler) {
        this._app.delete(`${this._settings.path}${path}`, this._asyncHandler(handler));
    }
    
    run() {
        this._app.use(this._sendError.bind(this));
        this._httpServer = this._app.listen(
            this._settings.port,
            () => this._logger.info(`listening on port ${this._settings.port}`)
        );
    }
    async stop() {
        if (this._httpServer == undefined) {
            return;
        }

        const httpServerCloseCallback = (error, resolve, reject) => {
            if (error != undefined) {
                reject(error);
            }

            this._logger.info('Http server is stopped');
            resolve();
        };
        return new Promise((resolve, reject) => {
            this._logger.info('Http server is stopping');
            this._httpServer.close(error => httpServerCloseCallback(error, resolve, reject));
        });
    };

    _sendError(error, request, response, next) {
        this._logger.error(error);
        response
            .status(error.code || 500)
            .json({ error: error.message })
        ;
    }
    _asyncHandler(handler) {
        return async (request, response, next) => {
            try {
                await handler(request, response);

            } catch (error) {
                next(error);
            }
        }
    }
};