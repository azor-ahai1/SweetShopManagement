import { jest } from '@jest/globals';

// Create a manual mock
const mockConnect = jest.fn();
const mockMongoose = {
    connect: mockConnect,
    connection: {
        host: 'test-host',
    },
};

// Mock the module
jest.unstable_mockModule('mongoose', () => ({
    default: mockMongoose,
}));

// Import after mocking
const { default: connectDB } = await import('../services/mongodb.js');

describe('Database Connection Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should connect to DB', async () => {
        mockConnect.mockResolvedValue({
            connection: {
                host: 'test-host',
            }
        });
        
        await expect(connectDB()).resolves.toBeUndefined();
        expect(mockConnect).toHaveBeenCalled();
    });
});