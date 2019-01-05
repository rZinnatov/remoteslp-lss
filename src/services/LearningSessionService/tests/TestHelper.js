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
    createServiceMock: (methodMock = async () => new Promise(resolve => resolve())) => {
        return {
            getSession: methodMock,
            getSessions: methodMock,
            createSession: methodMock,
            removeAllSessions: methodMock,
            removeSession: methodMock,
            removeSessions: methodMock
        };
    }
};