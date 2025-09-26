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


const buySweet = asyncHandler(async (req, res) => {
    const { buyer, sweet, quantity, comment, price } = req.body;
    const order = await Purchase.create({
        buyer, sweet, quantity, comment, price, orderDate: new Date(),
    })

    const sweetPurchase = await Purchase.findById(order._id)
    .populate('sweet', 'name')

    if (!sweetPurchase){
        throw new ApiError(404, "Something went wrong while purchasing sweet.");
    }

    const updatedSweet = await Sweet.findByIdAndUpdate(
        sweet,
        {stock:stock-quantity},
        { new: true }
    )

    if (!updatedSweet){
        throw new ApiError(404, "Something went wrong while purchasing sweet.");
    }

    return res.status(201).json(
        new ApiResponse(200, sweetPurchase, "Sweet Purchased Successfully")
    )
});


const addStock = asyncHandler(async (req, res) => {
    const { sweet, quantity } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId)
    if(!user || !user.isAdmin){
        throw new ApiError(403, "You are not authorised to add stock.");
    }

    const updatedSweet = await Sweet.findByIdAndUpdate(
        sweet,
        {stock:stock+quantity},
        { new: true }
    )

    if (!updatedSweet){
        throw new ApiError(401, "Something went wrong while purchasing sweet.");
    }

    return res.status(201).json(
        new ApiResponse(201, updatedSweet, "Sweet Purchased Successfully")
    )
});


const deleteSweet = asyncHandler(async (req, res) => {
    const { sweetId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId)
    if(!user || !user.isAdmin){
        throw new ApiError(403, "You are not authorised to delete sweet.");
    }

    try{
        await Sweet.findByIdAndDelete(sweetId);
        return res.status(201).json(
            new ApiResponse(201, updatedSweet, "Sweet Deleted Successfully")
        )

    } catch (error) {
        if (!updatedSweet){
            throw new ApiError(500, "Something went wrong while deleting sweet.");
        }
    }



}); 


const updateSweet = asyncHandler(async (req, res) => {
    const { name, price, description, category, quantity, image } = req.body;

    const sweetId = req.params.sweetId;

    const sweet = await Sweet.findById(sweetId);
    if (!sweet) {
        throw new ApiError(404, "Sweet not found");
    }

    if([name, description].some(
        (field) => field?.trim() === "" )
    ){
        throw new ApiError(400, "All fields are required");
    }

    if ((price <= 0) || (quantity <= 0)) {
        throw new ApiError(400, "Price and quantity must be greater than 0");
    }

    let uploadedImages = [];
    try {
        uploadedImages = JSON.parse(image || '[]');
    } catch (parseError) {
        throw new ApiError(400, "Invalid existing images format");
    }

    const sweetImagePath = req.files?.path;
    
    let sweetImageURL="";
    if(sweetImagePath){
        const sweetImage = await uploadProfileImageOnCloudinary(sweetImagePath);
        if(!sweetImage){
            throw new ApiError(400, "Image Upload Failed")
        }
        else{
            sweetImageURL = sweetImage.url
        }
    }
    
    const updatedSweet = await Sweet.findByIdAndUpdate(
        sweetId,
        { 
            $set:{
                name,
                price,
                description,
                stock,
                image: sweetImageURL,
                category: category,
            } 
        },
        { new: true }
    );

    return res.status(201).json(
        new ApiResponse(201, updatedSweet, "Sweet Updated Successfully")
    )
})


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