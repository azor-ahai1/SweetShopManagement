import { jest } from '@jest/globals';
import request from "supertest";

// Mock User model functions
const mockFindOne = jest.fn();
const mockCreate = jest.fn();  
const mockFindById = jest.fn();
const mockSelect = jest.fn();

jest.unstable_mockModule("../models/user.model.js", () => ({
  User: {
    findOne: mockFindOne,
    create: mockCreate,  
    findById: mockFindById
  }
}));

// Mock mongoose
jest.unstable_mockModule('mongoose', () => ({
  default: {
    connect: jest.fn().mockResolvedValue({}),
    connection: { host: 'test-host' },
  }
}));


// Import app after mocks
const { app } = await import("../app.js");

describe("User Controller Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    // Register test
    it("should register a new user successfully", async () => {
        const mockUser = {
        _id: "123",
        name: "John",
        email: "john@example.com",
        password: "hashed"
        };

        // Setup mocks
        mockFindOne.mockResolvedValue(null);
        mockCreate.mockResolvedValue(mockUser);
        mockFindById.mockReturnValue({
        select: mockSelect.mockResolvedValue({
            _id: mockUser._id,  
            name: mockUser.name,
            email: mockUser.email
        })
        });

        const res = await request(app)
        .post("/api/v1/users/register")
        .send({
            name: "John",
            email: "john@example.com",
            password: "123456"
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
        statusCode: 200,
        data: {
            _id: "123",
            name: "John",
            email: "john@example.com"
        },
        message: "User Registered Successfully",
        success: true
        });

        // Verify User model mocks were called
        expect(mockFindOne).toHaveBeenCalledWith({ email: "john@example.com" });
        expect(mockCreate).toHaveBeenCalledWith({
        name: "John",
        email: "john@example.com",
        password: "123456"
        });
        expect(mockFindById).toHaveBeenCalledWith("123");
    });

    // Login test 
    it("should login a user", async () => {
        const res = await request(app)
        .post("/api/v1/users/login")
        .send({ email: "john@example.com", password: "123456" });
        
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("User logged in successfully");
    });
});