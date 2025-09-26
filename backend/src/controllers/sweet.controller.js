import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"; 
import { asyncHandler } from "../utils/asyncHandler.js"; 
import { Sweet } from "../models/sweet.model.js"; 
import { uploadImageOnCloudinary } from "../services/cloudinary.js";

const createSweet = asyncHandler(async (req, res) => {
    
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Authentication required to create a sweet");
    }

    const { name, description, category, price, stock } = req.body;


    if ([name, description, category].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Name, description, and category are required");
    }


    if (!price || price <= 0) {
        throw new ApiError(400, "Price must be greater than 0");
    }

    if (stock !== undefined && stock < 0) {
        throw new ApiError(400, "Stock cannot be negative");
    }

    let imageUrl = "https://tse2.mm.bing.net/th/id/OIP.b2VM6VpFKtDuv1PUp3aj3AAAAA?rs=1&pid=ImgDetMain&o=7&rm=3"; // default image
    
    if (req.file?.path) { 
        const uploadedImage = await uploadImageOnCloudinary(req.file.path);
        if (!uploadedImage) {
            throw new ApiError(400, "Failed to upload sweet image");
        }
        imageUrl = uploadedImage.url;
    }

    const sweet = await Sweet.create({
        name,
        description,
        category,
        price,
        stock: stock || 0, 
        image: imageUrl,
    });

    const createdSweet = await Sweet.findById(sweet._id);
    
    if (!createdSweet) {
        throw new ApiError(500, "Something went wrong while creating sweet");
    }

    return res.status(201).json(
        new ApiResponse(201, createdSweet, "Sweet Created Successfully")
    );
});

const getAllSweets = asyncHandler(async (req, res) => {
    const sweets = await Sweet.find().populate('category', 'name');
    return res.status(200).json(
        new ApiResponse(200, sweets, "Sweets Retrieved Successfully")
    );
});

export { createSweet, getAllSweets };