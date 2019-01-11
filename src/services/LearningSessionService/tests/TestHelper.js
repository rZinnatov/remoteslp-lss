module.exports = {
    createSettingsMock: () => {
        return {
            api: {
                port: 3000,
                path: ''
            },
            storage: {
                url: '',
                dbName: '',
                collectionName: ''
            }
        };
    },
    createExpressMock: (methodMock = () => {}) => {
        return {
            use: methodMock,
            get: methodMock,
            put: methodMock,
            post: methodMock,
            delete: methodMock,
            listen: methodMock
        };
    },
    createApiDriverMock: (methodMock = () => {}) => {
        return {
            get: methodMock,
            put: methodMock,
            post: methodMock,
            delete: methodMock,
            run: methodMock,
            stop: methodMock
        };
    },
    createServiceMock: (methodMock = () => new Promise(resolve => resolve())) => {
        return {
            getSession: methodMock,
            getSessions: methodMock,
            createSession: methodMock,
            updateSession: methodMock,
            removeAllSessions: methodMock,
            removeSession: methodMock,
            removeSessions: methodMock
        };
    }
};