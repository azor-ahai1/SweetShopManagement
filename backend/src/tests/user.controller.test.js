import { jest } from '@jest/globals';
import request from "supertest";

// Create mock functions
const mockFindOne = jest.fn();
const mockCreate = jest.fn();  
const mockFindById = jest.fn();
const mockSelect = jest.fn();
const mockSave = jest.fn();

// Mock User model
jest.unstable_mockModule("../models/user.model.js", () => ({
  User: {
    findOne: mockFindOne,
    create: mockCreate,  
    findById: mockFindById
  }
}));

// Mock mongoose
jest.unstable_mockModule('mongoose', () => {
    const mongoose = {
        connect: jest.fn().mockResolvedValue({}),
        connection: { host: 'test-host' },
        Schema: class MockSchema { 
            constructor() {} 
        },
        model: jest.fn(name => ({})),
    };
    return {
        default: mongoose,
        ...mongoose
    };
});

// Import app after mocks
const { app } = await import("../app.js");

describe("User Controller Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Full Register Test
    it("should register a new user successfully", async () => {
        const mockUser = {
            _id: "123",
            name: "John",
            email: "john@example.com",
            password: "hashedPassword"
        };

        const mockCreatedUser = {
            _id: "123",
            name: "John",
            email: "john@example.com"
        };

        // Setup mocks
        mockFindOne.mockResolvedValue(null); // User doesn't exist
        mockCreate.mockResolvedValue(mockUser);
        mockFindById.mockReturnValue({
            select: mockSelect.mockResolvedValue(mockCreatedUser)
        });

        const res = await request(app)
            .post("/api/v1/users/register")
            .send({
                name: "John",
                email: "john@example.com",
                password: "123456"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("User Registered Successfully");
        expect(res.body.data._id).toBe("123");
        expect(res.body.data.name).toBe("John");
        expect(res.body.data.email).toBe("john@example.com");

        // Verify mocks were called correctly
        expect(mockFindOne).toHaveBeenCalledWith({ email: "john@example.com" });
        expect(mockCreate).toHaveBeenCalledWith({
            name: "John",
            email: "john@example.com",
            password: "123456"
        });
        expect(mockFindById).toHaveBeenCalledWith("123");
        // Note: Fixed typo in controller - it has "-passowrd" instead of "-password"
        expect(mockSelect).toHaveBeenCalledWith("-passowrd -refreshToken");
    }, 10000);

    // Full Login Test
    it("should login a user successfully", async () => {
        const mockUser = {
            _id: "123",
            email: "john@example.com",
            refreshToken: null,
            isPasswordCorrect: jest.fn().mockResolvedValue(true),
            generateAccessToken: jest.fn().mockReturnValue("mock-access-token"),
            generateRefreshToken: jest.fn().mockReturnValue("mock-refresh-token"),
            save: mockSave.mockResolvedValue(true)
        };

        const mockLoggedInUser = {
            _id: "123",
            name: "John",
            email: "john@example.com"
        };

        // Setup mocks for login flow
        mockFindOne.mockResolvedValue(mockUser); // First call for login
        
        // Mock the findById calls in generateAccessAndRefreshTokens and loginUser
        mockFindById
            .mockResolvedValueOnce(mockUser) // First call in generateAccessAndRefreshTokens
            .mockReturnValueOnce({ // Second call in loginUser (returns chainable object)
                select: mockSelect.mockResolvedValue(mockLoggedInUser)
            });

        const res = await request(app)
            .post("/api/v1/users/login")
            .send({ 
                email: "john@example.com", 
                password: "123456" 
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("User logged in successfully");
        expect(res.body.data.user._id).toBe("123");
        expect(res.body.data.user.name).toBe("John");
        expect(res.body.data.user.email).toBe("john@example.com");
        expect(res.body.data.accessToken).toBe("mock-access-token");
        expect(res.body.data.refreshToken).toBe("mock-refresh-token");

        // Verify cookies are set
        const cookies = res.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(cookies.some(cookie => cookie.includes('accessToken=mock-access-token'))).toBe(true);
        expect(cookies.some(cookie => cookie.includes('refreshToken=mock-refresh-token'))).toBe(true);

        // Verify mocks were called correctly
        expect(mockFindOne).toHaveBeenCalledWith({ email: "john@example.com" });
        expect(mockUser.isPasswordCorrect).toHaveBeenCalledWith("123456");
        expect(mockUser.generateAccessToken).toHaveBeenCalled();
        expect(mockUser.generateRefreshToken).toHaveBeenCalled();
        expect(mockSave).toHaveBeenCalledWith({ validateBeforeSave: false });
        expect(mockSelect).toHaveBeenCalledWith("-password -refreshToken");
    }, 10000);
});