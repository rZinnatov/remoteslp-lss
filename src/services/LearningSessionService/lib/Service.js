class Session {
    constructor(id) {
        this.id = id;
    }
}

module.exports = class Service {
    constructor(getNewId) {
        if (getNewId === undefined) {
            throw new ReferenceError('getNewId is not defined');
        }
        if (typeof getNewId !== 'function') {
            throw new TypeError('getNewId must be a function');
        }
        this.getNewId = getNewId;
    }
    registerNew() {
        return new Promise(
            resolve => {
                const session = new Session(
                    this.getNewId() // I hope we're all lucky enough
                );
                // TODO: Store in DB
                resolve(session);
            }
        );
    }
    isExists(id) {
        // TODO: Check in DB
        return false;
    }
};