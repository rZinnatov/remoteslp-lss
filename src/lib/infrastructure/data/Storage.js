
module.exports = class Storage {
    constructor(dbDriver, sessionsRepository) {
        this._dbDriver = dbDriver;
        this._sessionsRepository = sessionsRepository;
    }
    
    async stop() {
        await this._dbDriver.stop();
    }

    get sessions() {
        return this._sessionsRepository;
    }

    static async create(dbDriver) {
        return new Storage(
            dbDriver,
            await dbDriver.getSessionsRepository()
        );
    }
};