import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    title: string;
    slug: string;
    description: string;
    price: number;
    stripeProductId?: string;
    stripePriceId?: string;
    images: string[];
    category: mongoose.Types.ObjectId;
    featured: boolean;
    stock: number;
    paywall: {
        enabled: boolean;
        content: string;
    };
    layout?: any[];
    seo?: {
        title?: string;
        description?: string;
    };
    customizationConfig?: any;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        stripeProductId: { type: String },
        stripePriceId: { type: String },
        images: [{ type: String }],
        category: { type: Schema.Types.ObjectId, ref: "Category" },
        featured: { type: Boolean, default: false },
        stock: { type: Number, default: 0 },
        paywall: {
            enabled: { type: Boolean, default: false },
            content: { type: String },
        },
        layout: { type: Array },
        seo: {
            title: { type: String },
            description: { type: String },
        },
        customizationConfig: { type: Schema.Types.Mixed }, // Stores frame/mug specific data like printableArea, frameColor, etc.
    },
    { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
