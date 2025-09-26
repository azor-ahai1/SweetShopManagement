import { jest } from '@jest/globals';
import request from "supertest";

// Create User model mock functions
const mockFindOne = jest.fn();
const mockCreate = jest.fn();
const mockFindById = jest.fn();
const mockSelect = jest.fn();

// Mock the User model before importing
jest.unstable_mockModule("../models/user.model.js", () => ({
  User: {
    findOne: mockFindOne,
    create: mockCreate,
    findById: mockFindById,
  }
}));

// Mock mongoose to avoid connection issues
jest.unstable_mockModule('mongoose', () => ({
  default: {
    connect: jest.fn().mockResolvedValue({}),
    connection: { host: 'test-host' },
  }
}));

// Import after mocking
const { app } = await import("../app.js");

describe("POST /api/v1/users/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    expect(mockCreate).toHaveBeenCalled();
    expect(mockFindById).toHaveBeenCalledWith("123");
  });
});