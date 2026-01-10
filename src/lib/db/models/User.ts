import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    password?: string;
    name: string;
    role: "admin" | "customer";
    address?: {
        line1: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    phone?: string;
    cart: {
        items: {
            product: mongoose.Types.ObjectId;
            quantity: number;
        }[];
    };
    wishlist: mongoose.Types.ObjectId[];
    purchases: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String },
        name: { type: String, required: true },
        role: { type: String, enum: ["admin", "customer"], default: "customer" },
        address: {
            line1: { type: String, default: "" },
            city: { type: String, default: "" },
            state: { type: String, default: "" },
            postalCode: { type: String, default: "" },
            country: { type: String, default: "India" },
        },
        phone: { type: String, default: "" },
        cart: {
            items: [
                {
                    product: { type: Schema.Types.ObjectId, ref: "Product" },
                    quantity: { type: Number, default: 1 },
                },
            ],
        },
        wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
        purchases: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    },
    {
        timestamps: true,
        // Ensure that fields not in schema are NOT dropped if we use direct mongo calls, 
        // but here we want to ensure they ARE in the schema to be saved by Mongoose.
        strict: true
    }
);

// In Next.js, models are often cached. If we updated the schema, the cached model
// might not have the new fields. We check if the model exists, and if it does, 
// we might need to delete it to re-register with the new schema during development.
if (process.env.NODE_ENV === 'development') {
    if (mongoose.models.User) {
        console.log("Re-registering User Model to ensure schema freshness...");
        delete mongoose.models.User;
    }
}

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
