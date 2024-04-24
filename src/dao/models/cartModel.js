import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product" 
            },
            quantity: {
                type: Number,
                default: 1
            }
        }],
        default: [] 
    }
});

cartSchema.plugin(mongoosePaginate)

export const cartModel = mongoose.model(cartCollection, cartSchema);
export default cartModel;