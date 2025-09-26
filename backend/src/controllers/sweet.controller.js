import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"; 
import { asyncHandler } from "../utils/asyncHandler.js"; 
import { Sweet } from "../models/sweet.model.js"; 
import { uploadImageOnCloudinary } from "../services/cloudinary.js";
import { Purchase } from "../models/purchase.model.js";
import { User } from "../models/user.model.js";

const createSweet = asyncHandler(async (req, res) => {
    
    const userId = req.user._id;

    const user = await User.findById(userId);
    if(!user || !user.isAdmin){
        throw new ApiError(403, "You are not authorised to create sweet.");
    }

    const { name, description, category, price, stock } = req.body;
    
    // console.log(name, description, category, price, stock);
    
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

    // console.log(req.file?.path)

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


const buySweet = asyncHandler(async (req, res) => {
    const { quantity, comment, price } = req.body;
    const buyer = req.user._id;
    const sweet = req.params.sweet;

    const sweetItem = await Sweet.findById(sweet);
    if (!sweetItem) {
        throw new ApiError(404, "Sweet not found.");
    }

    if (sweetItem.stock < quantity) {
        throw new ApiError(400, "Insufficient stock available.");
    }

    const order = await Purchase.create({
        buyer, 
        sweet, 
        quantity, 
        comment, 
        price: price || sweetItem.price, 
        orderDate: new Date(),
    });

    const sweetPurchase = await Purchase.findById(order._id)
        .populate('sweet', 'name');

    if (!sweetPurchase) {
        throw new ApiError(404, "Something went wrong while purchasing sweet.");
    }

    const updatedSweet = await Sweet.findByIdAndUpdate(
        sweet,
        { stock: sweetItem.stock - quantity },
        { new: true }
    );

    if (!updatedSweet) {
        throw new ApiError(404, "Something went wrong while updating stock.");
    }

    return res.status(201).json(
        new ApiResponse(200, sweetPurchase, "Sweet Purchased Successfully")
    );
});


const addStock = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const sweet = req.params.sweet;
    const userId = req.user._id;
    // console.log(sweet, quantity);

    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
        throw new ApiError(403, "You are not authorised to add stock.");
    }

    if (!quantity || quantity <= 0) {
        throw new ApiError(400, "Quantity must be a positive number.");
    }

    const sweetItem = await Sweet.findById(sweet);
    if (!sweetItem) {
        throw new ApiError(404, "Sweet not found.");
    }

    sweetItem.stock += quantity;
    await sweetItem.save();

    return res.status(200).json(
        new ApiResponse(200, sweetItem, "Sweet stock updated successfully")
    );
});



const deleteSweet = asyncHandler(async (req, res) => {
    const { sweetId } = req.params.sweet;
    const userId = req.user._id;

    const user = await User.findById(userId)
    if(!user || !user.isAdmin){
        throw new ApiError(403, "You are not authorised to delete sweet.");
    }

    try{
        await Sweet.findByIdAndDelete(sweetId);
        return res.status(201).json(
            new ApiResponse(201, {}, "Sweet Deleted Successfully")
        )

    } catch (error) {
        throw new ApiError(500, "Something went wrong while deleting sweet.");
    }
}); 


const updateSweet = asyncHandler(async (req, res) => {
  const { name, price, description, category, stock } = req.body; 
  const sweetId = req.params.sweet;

  const sweet = await Sweet.findById(sweetId);
  if (!sweet) {
    throw new ApiError(404, "Sweet not found");
  }

  if ([name, description].some(field => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  if (price <= 0 || stock < 0) {
    throw new ApiError(400, "Price must be > 0 and stock cannot be negative");
  }
  let sweetImageURL = sweet.image; 
  if (req.file) {
    const uploadedImage = await uploadImageOnCloudinary(req.file.path);
    if (!uploadedImage) {
      throw new ApiError(400, "Image Upload Failed");
    }
    sweetImageURL = uploadedImage.url;
  }

  const updatedSweet = await Sweet.findByIdAndUpdate(
    sweetId,
    {
      $set: {
        name,
        price,
        description,
        stock,
        image: sweetImageURL,
        category,
      }
    },
    { new: true }
  );

  return res.status(200).json(
    new ApiResponse(200, updatedSweet, "Sweet Updated Successfully")
  );
});



const searchSweet = asyncHandler(async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;

  const query = {};

  if (name) {
    query.name = { $regex: name, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sweets = await Sweet.find(query).populate("category", "name");

  return res.status(200).json(
    new ApiResponse(200, sweets, "Sweets searched successfully")
  );
});


export { createSweet, getAllSweets, buySweet, addStock, deleteSweet, updateSweet, searchSweet };