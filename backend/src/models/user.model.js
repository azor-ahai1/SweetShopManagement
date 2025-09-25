import mongoose, { Schema } from "mongoose";

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

export const User = mongoose.model("User", userSchema);