import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Purchase } from "../models/purchase.model.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body
    console.log("email: ", email);

    if([name, email, password].some(
        (field) => field?.trim() === "" )
    ){
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({email})

    if (existedUser) {
        throw new ApiError(409, "User with E-mail already exists");
    }

    const user = await User.create({
        name, 
        email, 
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(createdUser._id);
    
    if(!accessToken){
        throw new ApiError(500, "Failed to generate access token");
    }
    if(!refreshToken){
        throw new ApiError(500, "Failed to generate refresh token");
    }

    return res.status(201).json(
        new ApiResponse(200, {user: createdUser, accessToken, refreshToken}, "User Registered Successfully")
    )

}) 

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if(!email){
        throw new ApiError(400, "Username or Email is required");
    }

    if(!password){
        throw new ApiError(400, "Password is required");
    }
    // console.log(email);
    const user = await User.findOne({email: email.toLowerCase()})

    if(!user){
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid Password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
    
    if(!accessToken){
        throw new ApiError(500, "Failed to generate access token");
    }
    if(!refreshToken){
        throw new ApiError(500, "Failed to generate refresh token");
    }

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        // expires: new Date(Date.now() + 30 * 24 * 60 * 60
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully",
        )
    )
})

const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId)
    .populate("purchaseHistory")
    .populate("sweet");

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  return res.status(200).json(
    new ApiResponse(200, user, "Current user retrieved successfully")
  );
});


const getUserPurchaseHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
   
    try {
        // Get purchases with proper population
        const purchases = await Purchase.find({ buyer: userId })
            .populate({
                path: "sweet",
                select: "name category price image stock",
                // Handle case where sweet might be deleted
                options: {
                    strictPopulate: false
                }
            })
            .sort({ createdAt: -1 })
            .lean(); // Add lean() for better performance
   
        // Process purchases to handle deleted sweets and calculate totals
        const processedPurchases = purchases.map(purchase => ({
            ...purchase,
            // Ensure we have the purchase price (fallback to sweet price if needed)
            price: purchase.price || (purchase.sweet ? purchase.sweet.price : 0),
            // Handle case where sweet might be null (deleted)
            sweet: purchase.sweet || {
                name: "Product Unavailable",
                category: "Unknown",
                price: purchase.price || 0,
                image: "https://tse2.mm.bing.net/th/id/OIP.b2VM6VpFKtDuv1PUp3aj3AAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
                stock: 0,
                _id: null
            }
        }));
   
        const totalPurchases = processedPurchases.length;
        const totalSpent = processedPurchases.reduce((sum, purchase) => 
            sum + (purchase.price * purchase.quantity), 0
        );
   
        return res.status(200).json(
            new ApiResponse(200, {
                purchases: processedPurchases,
                totalPurchases,
                totalSpent
            }, "User purchase history retrieved successfully")
        );
    } catch (error) {
        console.error("Error fetching purchase history:", error);
        return res.status(500).json(
            new ApiResponse(500, null, "Error fetching purchase history")
        );
    }
});


const generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user = await User.findById(userId);
        if(!user) {
            throw new ApiError('User not found while generating tokens', 404);
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}
    }
    catch(error){
        throw new ApiError(500, "Something went wrong while generating Tokens during Login");
    }
}

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError('No refresh token provided', 401);
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError('User not found while refreshing token', 404);
        }
        
        if(incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError('Refresh token is expired', 401);
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, refreshToken: newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken: newRefreshToken
                },
                "Refresh token generated successfully",
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})


export {registerUser, loginUser, getUserPurchaseHistory, getCurrentUser};