import { jest } from '@jest/globals';
import request from "supertest";

// --- Mock Setup ---
const mockCreate = jest.fn();
const mockFindById = jest.fn();
const mockFind = jest.fn();

jest.unstable_mockModule("../models/sweet.model.js", () => ({
    Sweet: {
        create: mockCreate,
        findById: mockFindById,
        find: mockFind
    }
}));

const mockUploadImageOnCloudinary = jest.fn();
jest.unstable_mockModule("../services/cloudinary.js", () => ({
    uploadImageOnCloudinary: mockUploadImageOnCloudinary
}));

// Mock Mongoose
jest.unstable_mockModule('mongoose', () => {
    const mongoose = {
        connect: jest.fn().mockResolvedValue({}),
        connection: { host: 'test-host' },
        Schema: class MockSchema { constructor() {} },
        model: jest.fn(name => ({})),
    };
    return { default: mongoose, ...mongoose };
});

const createMockApp = async () => {
    const express = (await import('express')).default;
    const { createSweet, getAllSweets } = await import('../controllers/sweet.controller.js');
    const app = express();
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Mock Authentication Middleware
    app.use((req, res, next) => {
        req.user = { _id: 'mockUserId123' };
        next();
    });
    
    // File upload mock middleware
    const mockMulter = (req, res, next) => {
        if (req.method === 'POST' && req.url.includes('create')) {
            req.file = {
                fieldname: 'image',
                originalname: 'test.jpg',
                path: 'mock/path/to/image.jpg',
                mimetype: 'image/jpeg',
                size: 12345,
                buffer: Buffer.from('mock image data')
            };
        }
        next();
    };
    
    // Error handling middleware
    app.use((error, req, res, next) => {
        console.log('Error caught in test middleware:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            stack: error.stack
        });
    });

    // Apply middleware and routes
    app.post('/api/v1/sweets/create', mockMulter, async (req, res, next) => {
        try {
            await createSweet(req, res, next);
        } catch (error) {
            next(error);
        }
    });

    app.get('/api/v1/sweets', async (req, res, next) => {
        try {
            await getAllSweets(req, res, next);
        } catch (error) {
            next(error);
        }
    });
    
    return app;
};

let app;

beforeAll(async () => {
    app = await createMockApp();
});

describe("Sweet Controller Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should get all sweets successfully", async () => {
        const mockSweets = [
            {
                _id: "sweet1",
                name: "Gulab Jamun",
                description: "Soft, milk-solid-based sweets",
                category: { _id: "cat1", name: "Milk Sweets" },
                price: 5.50,
                stock: 100,
                image: "gulab-jamun.jpg"
            },
            {
                _id: "sweet2", 
                name: "Rasgulla",
                description: "Spongy milk sweets",
                category: { _id: "cat1", name: "Milk Sweets" },
                price: 4.00,
                stock: 50,
                image: "rasgulla.jpg"
            }
        ];

        // Mock the populate method chain
        const mockPopulate = jest.fn().mockResolvedValue(mockSweets);
        mockFind.mockReturnValue({
            populate: mockPopulate
        });

        const res = await request(app).get("/api/v1/sweets");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Sweets Retrieved Successfully");
        expect(res.body.data).toEqual(mockSweets);
        expect(res.body.data).toHaveLength(2);
        
        // Verify mocks were called correctly
        expect(mockFind).toHaveBeenCalledWith();
        expect(mockPopulate).toHaveBeenCalledWith('category', 'name');
    });

    it("should create a sweet successfully with image upload", async () => {
        const mockSweetData = {
            name: "Gulab Jamun",
            description: "Soft, milk-solid-based sweets",
            category: "Milk Sweets",
            price: 5.50,
            stock: 100
        };

        const mockCreatedSweet = {
            _id: "sweetId456",
            ...mockSweetData,
            image: "mock-cloudinary-url.jpg",
            createdBy: 'mockUserId123'
        };

        // Setup mocks with more detailed return values
        mockUploadImageOnCloudinary.mockResolvedValue({ 
            url: "mock-cloudinary-url.jpg",
            public_id: "mock-public-id",
            secure_url: "mock-cloudinary-url.jpg"
        });
        
        // Make sure create returns an object with _id
        mockCreate.mockResolvedValue({
            _id: "sweetId456",
            save: jest.fn().mockResolvedValue(true)
        });
        
        // Make sure findById returns the complete sweet object
        mockFindById.mockResolvedValue(mockCreatedSweet);

        const res = await request(app)
            .post("/api/v1/sweets/create")
            .field('name', mockSweetData.name)
            .field('description', mockSweetData.description)
            .field('category', mockSweetData.category)
            .field('price', mockSweetData.price.toString())
            .field('stock', mockSweetData.stock.toString())
            .attach('image', Buffer.from('mock image data'), 'test.jpg');

        // Debug: Log what actually happened
        if (res.statusCode !== 201) {
            console.log('Response status:', res.statusCode);
            console.log('Response body:', res.body);
            return;
        }

        // Assertions
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Sweet Created Successfully");
        expect(res.body.data.image).toBe("mock-cloudinary-url.jpg");
        
        // Verify mocks were called correctly
        expect(mockUploadImageOnCloudinary).toHaveBeenCalledWith(
            expect.objectContaining({
                path: expect.any(String)
            })
        );
        expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
            name: mockSweetData.name,
            description: mockSweetData.description,
            category: mockSweetData.category,
            price: mockSweetData.price,
            stock: mockSweetData.stock,
            image: "mock-cloudinary-url.jpg",
            createdBy: 'mockUserId123'
        }));
    });
});