import connectDB from '../services/mongodb.js';

describe('Database Connection Service', () => {
    test('should attempt to connect to DB', async () => {
        await expect(connectDB()).rejects.toThrow();
    });
});
