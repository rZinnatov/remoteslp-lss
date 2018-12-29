const LearningSessionService = require('./../lib/Service');


test('LearningSessionService requires getNewUuid', () => {
    expect(() => new LearningSessionService()).toThrow(ReferenceError);
});
test('LearningSessionService requires getNewUuid to be a function', () => {
    expect(() => new LearningSessionService(123)).toThrow(TypeError);
    expect(() => new LearningSessionService('123')).toThrow(TypeError);
    expect(() => new LearningSessionService(null)).toThrow(TypeError);
    expect(() => new LearningSessionService({})).toThrow(TypeError);
    expect(() => new LearningSessionService(Symbol())).toThrow(TypeError);
    expect(() => new LearningSessionService(true)).toThrow(TypeError);

    expect(() => new LearningSessionService(() => {})).not.toThrow(TypeError);
});
test('register new returns a valid session', async () => {
    const fakeUuid = '123-fakeUuid-456';
    const learningSessionService = new LearningSessionService(
        () => fakeUuid
    );
    
    const session = await learningSessionService.registerNew();
    expect(typeof session).toBe('object');
    expect(session).toHaveProperty('id');
    expect(session.id).toBe(fakeUuid);
});