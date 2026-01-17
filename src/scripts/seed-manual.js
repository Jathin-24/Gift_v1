
const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
const mongoose = require("mongoose");

// Define minimal schemas for seeding
const CategorySchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        image: { type: String },
    },
    { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        images: [{ type: String }],
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        featured: { type: Boolean, default: false },
        stock: { type: Number, default: 0 },
        customizationConfig: { type: mongoose.Schema.Types.Mixed },
    },
    { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const seedData = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const categories = [
        {
            title: "Frames",
            slug: "frames",
            description: "Elegant frames to cherish your memories.",
            image: "https://images.pexels.com/photos/10549924/pexels-photo-10549924.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
        {
            title: "Mugs",
            slug: "mugs",
            description: "Custom mugs for your daily brew.",
            image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
        {
            title: "Collages",
            slug: "collages",
            description: "Combine your favorite moments.",
            image: "https://images.pexels.com/photos/3576210/pexels-photo-3576210.jpeg?auto=compress&cs=tinysrgb&w=800",
        }
    ];

    for (const catData of categories) {
        let category = await Category.findOne({ slug: catData.slug });

        if (!category) {
            category = await Category.create(catData);
            console.log(`Created category: ${catData.title}`);
        } else {
            console.log(`Category exists: ${catData.title}`);
        }

        // Seed products for this category
        const products = [];
        if (catData.slug === 'frames') {
            products.push({
                title: "Classic Wood Frame",
                slug: "classic-wood-frame",
                description: "A timeless wooden frame perfect for any decor.",
                price: 599,
                images: ["https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=800"],
                stock: 50,
                featured: true,
                category: category._id,
                customizationConfig: {
                    category: 'frame',
                    frameColor: '#8B4513',
                    innerPadding: 60,
                    borderWidth: 40,
                    printArea: { width: 280, height: 350, x: 60, y: 75 }
                }
            });
            products.push({
                title: "Modern Metal Frame",
                slug: "modern-metal-frame",
                description: "Sleek metal frame for a modern look.",
                price: 799,
                images: ["https://images.pexels.com/photos/10549924/pexels-photo-10549924.jpeg?auto=compress&cs=tinysrgb&w=800"],
                stock: 50,
                featured: true,
                category: category._id,
                customizationConfig: {
                    category: 'frame',
                    frameColor: '#C0C0C0',
                    innerPadding: 40,
                    borderWidth: 30,
                    printArea: { width: 320, height: 400, x: 40, y: 50 }
                }
            });
            products.push({
                title: "Vintage Gold Frame",
                slug: "vintage-gold-frame",
                description: "An ornate gold frame for special memories.",
                price: 899,
                images: ["https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=800"],
                stock: 30,
                featured: true,
                category: category._id,
                customizationConfig: {
                    category: 'frame',
                    frameColor: '#FFD700',
                    innerPadding: 70,
                    borderWidth: 45,
                    printArea: { width: 270, height: 340, x: 65, y: 80 }
                }
            });
        } else if (catData.slug === 'mugs') {
            products.push({
                title: "Classic White Mug",
                slug: "classic-white-mug",
                description: "A standard white ceramic mug for your designs.",
                price: 399,
                images: ["https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800"],
                stock: 100,
                featured: true,
                category: category._id,
                customizationConfig: {
                    category: 'mug',
                    printArea: { width: 200, height: 150, x: 100, y: 125 }
                }
            });
            products.push({
                title: "Magic Color Mug",
                slug: "magic-color-mug",
                description: "Reveals your photo when hot liquid is poured.",
                price: 499,
                images: ["https://images.pexels.com/photos/8961725/pexels-photo-8961725.jpeg?auto=compress&cs=tinysrgb&w=800"],
                stock: 50,
                featured: true,
                category: category._id,
                customizationConfig: {
                    category: 'mug',
                    printArea: { width: 180, height: 140, x: 110, y: 130 }
                }
            });
        } else if (catData.slug === 'collages') {
            products.push({
                title: "4 Photo Collage",
                slug: "4-photo-collage",
                description: "Display 4 of your favorite photos together.",
                price: 799,
                images: ["https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800"],
                stock: 100,
                featured: true,
                category: category._id,
                customizationConfig: {
                    category: 'collage',
                    gridLayout: { rows: 2, cols: 2 },
                    printArea: { width: 380, height: 480, x: 10, y: 10 }
                }
            });
            products.push({
                title: "6 Photo Collage",
                slug: "6-photo-collage",
                description: "A beautiful arrangement for 6 photos.",
                price: 899,
                images: ["https://images.pexels.com/photos/3576210/pexels-photo-3576210.jpeg?auto=compress&cs=tinysrgb&w=800"],
                stock: 100,
                featured: true,
                category: category._id,
                customizationConfig: {
                    category: 'collage',
                    gridLayout: { rows: 2, cols: 3 },
                    printArea: { width: 380, height: 480, x: 10, y: 10 }
                }
            });
        }

        for (const prodData of products) {
            const existingProd = await Product.findOne({ slug: prodData.slug });
            if (!existingProd) {
                await Product.create(prodData);
                console.log(`Created product: ${prodData.title}`);
            } else {
                existingProd.category = category._id;
                existingProd.featured = true;
                existingProd.customizationConfig = prodData.customizationConfig; // Ensure config is updated
                existingProd.price = prodData.price;
                await existingProd.save();
                console.log(`Product exists (updated): ${prodData.title}`);
            }
        }
    }

    console.log("Seeding complete.");
    mongoose.connection.close();
};

seedData().catch((err) => {
    console.error(err);
    mongoose.connection.close();
});
