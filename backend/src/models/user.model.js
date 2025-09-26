import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: [true, 'Password is Required'],
        },

        purchaseHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Purchase'
            }
        ],

        isAdmin: {
            type: Boolean,
            default: false
        },

        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next){
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
} 

userSchema.methods.generateAccessToken = function () {
    // console.log(process.env.ACCESS_TOKEN_SECRET);
    return jwt.sign(
        { 
            _id: this._id,
            email: this.email,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        { 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        },
                
    )
}

userSchema.methods.generateRefreshToken = function () {
    // console.log(process.env.REFRESH_TOKEN_SECRET);
    return jwt.sign(
        { 
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { 
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        },                
    )
}


export const User = mongoose.model("User", userSchema);