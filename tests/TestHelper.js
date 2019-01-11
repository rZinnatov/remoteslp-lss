module.exports = {
    createLoggerMock: () => ({
        info: () => {},
        error: () => {}
    }),
    createSettingsMock: () => ({
        api: {
            port: 3000,
            path: ''
        },
        storage: {
            url: '',
            dbName: '',
            collectionName: ''
        }
    }),
    createExpressMock: (methodMock = () => {}) => ({
        use: methodMock,
        get: methodMock,
        put: methodMock,
        post: methodMock,
        delete: methodMock,
        listen: methodMock
    }),
    createApiDriverMock: (methodMock = () => {}) => ({
        get: methodMock,
        put: methodMock,
        post: methodMock,
        delete: methodMock,
        run: methodMock,
        stop: methodMock
    }),
    createServiceMock: (methodMock = () => new Promise(resolve => resolve())) => ({
        getSession: methodMock,
        getSessions: methodMock,
        createSession: methodMock,
        updateSession: methodMock,
        removeAllSessions: methodMock,
        removeSession: methodMock,
        removeSessions: methodMock
    })
};