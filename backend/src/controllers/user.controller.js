import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

    const createdUser = await User.findById(user._id).select(
        "-passowrd -refreshToken"
    )

    if (!createdUser){
        throw new ApiError(404, "Something went wrong while registering the user.");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

}) 