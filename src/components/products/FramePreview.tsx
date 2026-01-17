"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, ZoomIn, ZoomOut, RotateCw, Move, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface FramePreviewProps {
    productImage: string;
    productTitle: string;
    category?: string;
    price?: number;
    config?: {
        category: 'frame' | 'mug' | 'collage';
        frameColor?: string;
        innerPadding?: number;
        borderWidth?: number;
        printArea?: { width: number; height: number; x: number; y: number };
        gridLayout?: { rows: number; cols: number };
    };
}

export default function FramePreview({ productImage, productTitle, category, price, config }: FramePreviewProps) {
    const [uploadedImages, setUploadedImages] = useState<{ id: number; src: string; imgElement: HTMLImageElement }[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Image manipulation states
    const [imageTransform, setImageTransform] = useState({
        scale: 1,
        x: 0,
        y: 0,
        rotation: 0
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Constants for canvas size - internal resolution
    const CANVAS_WIDTH = 400;
    const CANVAS_HEIGHT = 500;

    // Auto-fit image to print area
    const autoFitImage = (img: HTMLImageElement, printArea: any) => {
        if (!printArea) return { scale: 1, x: 0, y: 0, rotation: 0 };

        const { width: frameW, height: frameH } = printArea;
        const imgAspect = img.width / img.height;
        const frameAspect = frameW / frameH;

        let scale;
        if (imgAspect > frameAspect) {
            // Image is wider - fit to height
            scale = frameH / img.height;
        } else {
            // Image is taller - fit to width
            scale = frameW / img.width;
        }

        return { scale: scale * 1.1, x: 0, y: 0, rotation: 0 };
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const newImage = {
                        id: Date.now() + Math.random(),
                        src: event.target?.result as string,
                        imgElement: img
                    };

                    setUploadedImages(prev => {
                        // For single frame/mug, replace existing. For collage, append.
                        if (config?.category === 'collage') {
                            return [...prev, newImage];
                        }
                        return [newImage];
                    });

                    // Auto-fit first image
                    if (uploadedImages.length === 0 || config?.category !== 'collage') {
                        const transform = autoFitImage(img, config?.printArea || { width: 300, height: 400, x: 50, y: 50 });
                        setImageTransform(transform);
                    }
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    // Draw functions
    const drawFramePreview = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        const frameColor = config?.frameColor || '#000000';
        const borderWidth = config?.borderWidth || 40;
        const printArea = config?.printArea || { width: 280, height: 350, x: 60, y: 75 };

        // 1. Draw frame background (The Frame itself)
        ctx.fillStyle = frameColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Draw inner white mat
        // The user's code: const matInset = product.borderWidth;
        const matInset = borderWidth;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(matInset, matInset, canvas.width - matInset * 2, canvas.height - matInset * 2);

        // 3. Draw inner shadow for depth
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 2;
        ctx.strokeRect(matInset + 2, matInset + 2, canvas.width - matInset * 2 - 4, canvas.height - matInset * 2 - 4);

        // Draw photo area
        const { x: printX, y: printY, width: printW, height: printH } = printArea;

        if (uploadedImages.length > 0) {
            const img = uploadedImages[currentImageIndex]; // Use 0 for single
            if (img && img.imgElement) {
                ctx.save();

                // Set clipping region
                ctx.beginPath();
                ctx.rect(printX, printY, printW, printH);
                ctx.clip();

                // Calculate center point
                const centerX = printX + printW / 2;
                const centerY = printY + printH / 2;

                // Apply transformations
                ctx.translate(centerX + imageTransform.x, centerY + imageTransform.y);
                ctx.rotate((imageTransform.rotation * Math.PI) / 180);
                ctx.scale(imageTransform.scale, imageTransform.scale);

                // Draw image centered
                ctx.drawImage(
                    img.imgElement,
                    -img.imgElement.width / 2,
                    -img.imgElement.height / 2,
                    img.imgElement.width,
                    img.imgElement.height
                );

                ctx.restore();
            }
        } else {
            // Placeholder
            ctx.fillStyle = '#e0e0e0';
            ctx.fillRect(printX, printY, printW, printH);
            ctx.fillStyle = '#999';
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Upload Photo', printX + printW / 2, printY + printH / 2);
        }
    };

    const drawMugPreview = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        const printArea = config?.printArea || { width: 200, height: 150, x: 100, y: 125 };

        // Draw mug background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw mug body
        const mugGradient = ctx.createLinearGradient(50, 100, 350, 400);
        // Simple heuristic for "Magic" vs "White" based on title
        if (productTitle.toLowerCase().includes('magic') || productTitle.toLowerCase().includes('black')) {
            mugGradient.addColorStop(0, '#000000');
            mugGradient.addColorStop(1, '#333333');
        } else {
            mugGradient.addColorStop(0, '#ffffff');
            mugGradient.addColorStop(1, '#e0e0e0');
        }

        ctx.fillStyle = mugGradient;
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(300, 100);
        ctx.lineTo(320, 400);
        ctx.lineTo(80, 400);
        ctx.closePath();
        ctx.fill();

        // Draw handle
        ctx.strokeStyle = mugGradient; // simplified
        if (productTitle.toLowerCase().includes('magic')) ctx.strokeStyle = '#222';
        else ctx.strokeStyle = '#ddd';

        ctx.lineWidth = 15;
        ctx.beginPath();
        ctx.arc(320, 200, 40, -0.5, 0.5);
        ctx.stroke();

        // Draw print area with photo
        const { x: printX, y: printY, width: printW, height: printH } = printArea;

        if (uploadedImages.length > 0) {
            const img = uploadedImages[0];
            if (img && img.imgElement) {
                ctx.save();

                // For mug, we might want a slight curve or just rect clip for now
                ctx.beginPath();
                ctx.rect(printX, printY, printW, printH);
                ctx.clip();

                const centerX = printX + printW / 2;
                const centerY = printY + printH / 2;

                ctx.translate(centerX + imageTransform.x, centerY + imageTransform.y);
                ctx.rotate((imageTransform.rotation * Math.PI) / 180);
                ctx.scale(imageTransform.scale, imageTransform.scale);

                ctx.drawImage(
                    img.imgElement,
                    -img.imgElement.width / 2,
                    -img.imgElement.height / 2,
                    img.imgElement.width,
                    img.imgElement.height
                );

                ctx.restore();
            }
        } else {
            // Placeholder on Mug
            ctx.fillStyle = 'rgba(200,200,200,0.3)';
            ctx.fillRect(printX, printY, printW, printH);
        }

        // Mug shine effect
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.ellipse(200, 150, 60, 120, 0.3, 0, Math.PI * 2);
        ctx.fill();
    };

    const drawCollagePreview = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        const gridLayout = config?.gridLayout || { rows: 2, cols: 2 };
        const { rows, cols } = gridLayout;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cellWidth = (canvas.width - 20) / cols;
        const cellHeight = (canvas.height - 20) / rows;
        const padding = 5;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = 10 + col * cellWidth + padding;
                const y = 10 + row * cellHeight + padding;
                const w = cellWidth - padding * 2;
                const h = cellHeight - padding * 2;

                const imgIndex = row * cols + col;

                if (uploadedImages[imgIndex]?.imgElement) {
                    const img = uploadedImages[imgIndex].imgElement;

                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(x, y, w, h);
                    ctx.clip();

                    // Simple center fit for collage cells
                    const scale = Math.max(w / img.width, h / img.height);
                    const scaledW = img.width * scale;
                    const scaledH = img.height * scale;
                    const offsetX = x + (w - scaledW) / 2;
                    const offsetY = y + (h - scaledH) / 2;

                    ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH);
                    ctx.restore();

                    ctx.strokeStyle = '#ddd';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x, y, w, h);
                } else {
                    ctx.fillStyle = '#f5f5f5';
                    ctx.fillRect(x, y, w, h);
                    ctx.strokeStyle = '#ddd';
                    ctx.strokeRect(x, y, w, h);
                    ctx.fillStyle = '#999';
                    ctx.font = '14px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(`Photo ${imgIndex + 1}`, x + w / 2, y + h / 2);
                }
            }
        }
    };

    // Use effect to draw
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Determine mode based on config or category fallback
        // Check if config exists, if not fallback to props category
        let mode = 'frame';
        if (config?.category) {
            mode = config.category;
        } else if (category === 'Mugs') {
            mode = 'mug';
        }

        if (mode === 'frame') {
            drawFramePreview(ctx, canvas);
        } else if (mode === 'mug') {
            drawMugPreview(ctx, canvas);
        } else if (mode === 'collage') {
            drawCollagePreview(ctx, canvas);
        } else {
            drawFramePreview(ctx, canvas);
        }

    }, [uploadedImages, imageTransform, config, productTitle, category]);


    // Mouse Handlers
    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        const rect = canvasRef.current!.getBoundingClientRect();
        // Adjust for canvas scaling if displayed smaller than actual size
        const scaleX = CANVAS_WIDTH / rect.width;
        const scaleY = CANVAS_HEIGHT / rect.height;

        setDragStart({
            x: (e.clientX - rect.left) * scaleX - imageTransform.x,
            y: (e.clientY - rect.top) * scaleY - imageTransform.y
        });
    };

    const handleCanvasMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const rect = canvasRef.current!.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / rect.width;
        const scaleY = CANVAS_HEIGHT / rect.height;

        setImageTransform(prev => ({
            ...prev,
            x: (e.clientX - rect.left) * scaleX - dragStart.x,
            y: (e.clientY - rect.top) * scaleY - dragStart.y
        }));
    };

    const handleCanvasMouseUp = () => {
        setIsDragging(false);
    };


    return (
        <div className="space-y-6">
            <div className="bg-secondary/20 rounded-3xl p-6 border border-border/50">
                <div className="flex flex-col items-center">
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        className="max-w-full h-auto shadow-sm rounded-lg cursor-move touch-none bg-white"
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={handleCanvasMouseUp}
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="bg-background border border-border rounded-xl p-4 shadow-sm">
                <div className="space-y-4">
                    {/* Upload Button */}
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm"
                        >
                            <Upload className="w-5 h-5" />
                            {uploadedImages.length > 0 ? "Change Photo" : "Upload Photo"}
                        </button>
                    </div>

                    {/* Image Controls */}
                    {uploadedImages.length > 0 && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setImageTransform(prev => ({ ...prev, scale: Math.max(0.1, prev.scale - 0.1) }))}
                                    className="flex items-center justify-center gap-2 bg-secondary py-2 rounded-lg text-sm hover:bg-secondary/80"
                                >
                                    <ZoomOut className="w-4 h-4" /> Zoom Out
                                </button>
                                <button
                                    onClick={() => setImageTransform(prev => ({ ...prev, scale: Math.min(3, prev.scale + 0.1) }))}
                                    className="flex items-center justify-center gap-2 bg-secondary py-2 rounded-lg text-sm hover:bg-secondary/80"
                                >
                                    <ZoomIn className="w-4 h-4" /> Zoom In
                                </button>
                                <button
                                    onClick={() => setImageTransform(prev => ({ ...prev, rotation: prev.rotation - 90 }))}
                                    className="flex items-center justify-center gap-2 bg-secondary py-2 rounded-lg text-sm hover:bg-secondary/80"
                                >
                                    <RotateCw className="w-4 h-4" /> Rotate
                                </button>
                                <button
                                    onClick={() => {
                                        if (uploadedImages[0]?.imgElement) {
                                            const transform = autoFitImage(uploadedImages[0].imgElement, config?.printArea || { width: 300, height: 400, x: 50, y: 50 });
                                            setImageTransform(transform);
                                        }
                                    }}
                                    className="flex items-center justify-center gap-2 bg-secondary py-2 rounded-lg text-sm hover:bg-secondary/80"
                                >
                                    <Move className="w-4 h-4" /> Reset
                                </button>
                            </div>
                            <p className="text-[10px] text-center text-muted-foreground">
                                Drag photo to position
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
