import mongoose, { Schema } from "mongoose";

const purchaseSchema = new mongoose.Schema(
    {
        sweet: {
            type: Schema.Types.ObjectId,
            ref: 'Sweet'
        },

        buyer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        price: {
            type: Number,
            required: true
        },
        
        quantity: {
            type: Number,
            required: true
        },
        
        comment: {
            type: String,
        },
    },
    {
        timestamps: true
    }
);

export const Purchase = mongoose.model("Purchase", purchaseSchema);