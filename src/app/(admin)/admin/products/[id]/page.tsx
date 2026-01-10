"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/ui/ImageUpload";

export default function EditProduct({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
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
        const fetchData = async () => {
            try {
                // Fetch Categories
                const catRes = await fetch("/api/admin/categories");
                const catData = await catRes.json();
                if (catRes.ok) setCategories(catData);

                // Fetch Product
                const productRes = await fetch(`/api/admin/products/${params.id}`);
                const data = await productRes.json();

                if (productRes.ok) {
                    setFormData({
                        title: data.title,
                        slug: data.slug,
                        price: data.price,
                        description: data.description,
                        stock: data.stock,
                        category: data.category?._id || data.category || "",
                        featured: data.featured || false,
                        images: data.images && data.images.length ? data.images : [""],
                    });
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

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
            const res = await fetch(`/api/admin/products/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/admin/products");
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to update product");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating product");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(`/api/admin/products/${params.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.push("/admin/products");
                router.refresh();
            } else {
                alert("Failed to delete product");
            }
        } catch (error) {
            alert("Error deleting product");
        }
    };

    if (initialLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter text-foreground decoration-blue-500 underline underline-offset-8">Edit Product</h1>
                </div>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="px-6 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-red-100 transition-all border border-red-200 dark:border-red-900/50"
                >
                    Delete Product
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card p-10 rounded-3xl border border-border shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="w-full px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            step="0.01"
                            className="w-full px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none font-medium"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block ml-1">Images</label>
                    {formData.images.map((url, index) => (
                        <div key={index}>
                            <ImageUpload
                                value={url}
                                onChange={(value) => handleImageChange(index, value)}
                                onRemove={() => removeImageField(index)}
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addImageField}
                        className="inline-flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700"
                    >
                        <Plus className="w-4 h-4" /> Add Image Field
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
                    <label htmlFor="featured" className="text-xs font-black uppercase tracking-widest cursor-pointer text-foreground">
                        Feature on Homepage
                    </label>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-grow py-5 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                    </button>
                    <Link
                        href="/admin/products"
                        className="px-10 py-5 bg-secondary text-foreground rounded-2xl font-black uppercase tracking-widest hover:bg-border transition-all flex items-center justify-center border border-border"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
