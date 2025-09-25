import mongoose, { Schema } from "mongoose";

const sweetSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
            unique: true,
        },

        price: {
            type: String,
            required: true,
        },

        stock: {
            type: String,
        },
        
        image: {
            type: String,
            default: "https://tse2.mm.bing.net/th/id/OIP.b2VM6VpFKtDuv1PUp3aj3AAAAA?rs=1&pid=ImgDetMain&o=7&rm=3"
        },
    },
    {
        timestamps: true
    }
);

export const Sweet = mongoose.model("Sweet", sweetSchema);