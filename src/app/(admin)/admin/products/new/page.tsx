"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function NewProduct() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        price: 0,
        description: "",
        stock: 0,
        category: "",
        featured: false,
        images: [""],
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/admin/categories");
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                    if (data.length > 0) {
                        setFormData(prev => ({ ...prev, category: data[0]._id }));
                    }
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked :
                name === "price" || name === "stock" ? parseFloat(value) : value
        }));
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ""] }));
    };

    const removeImageField = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, images: newImages.length ? newImages : [""] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/admin/products");
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to create product");
            }
        } catch (error) {
            console.error(error);
            alert("Error creating product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter">Add New Product</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card p-10 rounded-3xl border border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Product Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                            placeholder="e.g. Minimalist Watch"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Slug (Optional)</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="w-full px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                            placeholder="minimalist-watch"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            step="0.01"
                            className="w-full px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block">Product Images (URLs)</label>
                    {formData.images.map((url, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => handleImageChange(index, e.target.value)}
                                required
                                className="flex-grow px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                                placeholder="https://images.unsplash.com/..."
                            />
                            <button
                                type="button"
                                onClick={() => removeImageField(index)}
                                className="p-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addImageField}
                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Another Image
                    </button>
                </div>

                <div className="flex items-center gap-4 py-4">
                    <input
                        type="checkbox"
                        name="featured"
                        id="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="w-5 h-5 accent-blue-600"
                    />
                    <label htmlFor="featured" className="text-sm font-black uppercase tracking-tight cursor-pointer">
                        Feature this product on homepage
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Product"}
                </button>
            </form>
        </div>
    );
}
