import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: {
        product: mongoose.Types.ObjectId;
        title: string;
        price: number;
        quantity: number;
        image: string;
    }[];
    total: number;
    shippingAddress: {
        name: string;
        email: string;
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phone?: string;
    };
    paymentStatus: "pending" | "paid" | "failed";
    stripePaymentIntentId?: string;
    status: "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product" },
                title: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
                image: { type: String, required: true },
            },
        ],
        total: { type: Number, required: true },
        shippingAddress: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: String }, // Optional phone for order
        },
        paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
        stripePaymentIntentId: { type: String },
        status: { type: String, enum: ["processing", "shipped", "delivered", "cancelled"], default: "processing" },
    },
    { timestamps: true }
);

if (process.env.NODE_ENV === 'development') {
    if (mongoose.models.Order) {
        delete mongoose.models.Order;
    }
}

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
