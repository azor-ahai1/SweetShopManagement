import mongoose, { Schema } from "mongoose";

const purchaseSchema = new mongoose.Schema(
    {
        sweetID: {
            type: Schema.Types.ObjectId,
            ref: 'Purchase'
        },

        price: {
            type: String,
            required: true
        },

        quantity: {
            type: String,
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