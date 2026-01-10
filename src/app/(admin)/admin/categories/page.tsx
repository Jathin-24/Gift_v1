"use client";

import { useState, useEffect } from "react";
import { Plus, Tags, Trash2, Edit2, Loader2, X, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Category {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    image?: string;
}

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        image: ""
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/admin/categories");
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from title ONLY when creating new
        if (name === "title" && !editId) {
            const generatedSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
            setFormData(prev => ({ ...prev, slug: generatedSlug }));
        }
    };

    const handleEdit = (cat: Category) => {
        setEditId(cat._id);
        setFormData({
            title: cat.title,
            slug: cat.slug,
            description: cat.description || "",
            image: cat.image || ""
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to permanently delete the '${name}' category? This cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                fetchCategories();
                router.refresh();
            } else {
                alert("Failed to delete category");
            }
        } catch (error) {
            alert("Error during deletion procedure");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const url = editId ? `/api/admin/categories/${editId}` : "/api/admin/categories";
        const method = editId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setEditId(null);
                setFormData({ title: "", slug: "", description: "", image: "" });
                fetchCategories();
                router.refresh();
            } else {
                const error = await res.json();
                alert(error.message || "Operation failed");
            }
        } catch (error) {
            alert("An error occurred during communication with the server");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openCreateModal = () => {
        setEditId(null);
        setFormData({ title: "", slug: "", description: "", image: "" });
        setIsModalOpen(true);
    };

    if (loading) return (
        <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase underline decoration-blue-500 underline-offset-8">Category Management</h1>
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-6">Configure Product Taxonomies</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all shadow-xl shadow-black/5"
                >
                    <Plus className="w-4 h-4" />
                    New Repository
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat) => (
                    <div key={cat._id} className="bg-card border border-border p-8 rounded-[2.5rem] group hover:premium-shadow transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-all" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-6">
                                <div className="p-4 bg-secondary rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Tags className="w-6 h-6" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(cat)}
                                        className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id, cat.title)}
                                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-muted-foreground hover:text-red-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black italic uppercase tracking-tight text-foreground mb-2">{cat.title}</h3>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">/{cat.slug}</p>
                            <p className="text-xs text-muted-foreground font-bold leading-relaxed flex-grow">
                                {cat.description || "No classification brief provided for this category."}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Creation/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-background/40 animate-in fade-in duration-300">
                    <div className="bg-card border-2 border-border w-full max-w-xl rounded-[3rem] p-12 shadow-2xl relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-8 right-8 p-3 hover:bg-secondary rounded-2xl transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-10">
                            {editId ? "Update Repository" : "Initialize Category"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Identity Title</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none font-bold transition-all"
                                    placeholder="ELECTRO-GEAR"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">System Slug</label>
                                <input
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    className={`w-full px-6 py-4 rounded-2xl border outline-none font-mono text-[10px] font-black ${editId ? 'bg-secondary/30 text-muted-foreground border-border' : 'bg-secondary/50 border-border text-blue-600'}`}
                                    placeholder="electro-gear"
                                    readOnly={!!editId}
                                />
                                {editId && <p className="text-[8px] font-black text-muted-foreground uppercase ml-1 italic">Slug modification is locked for established repositories</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Asset Image URL</label>
                                <div className="flex gap-4">
                                    <div className="flex-grow">
                                        <input
                                            name="image"
                                            value={formData.image}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none font-bold transition-all"
                                            placeholder="https://images.unsplash.com/..."
                                        />
                                    </div>
                                    <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center border border-border overflow-hidden">
                                        {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-muted-foreground" />}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Classification Brief</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none font-bold transition-all min-h-[120px] resize-none"
                                    placeholder="Enter category description..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-xl shadow-black/5 flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editId ? "Push Updates" : "Commit Category"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
