import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80";

export const isValidUrl = (url: string) => {
    try {
        if (!url) return false;
        if (url.startsWith('/') || url.startsWith('data:')) return true;
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const getValidImage = (url?: string) => {
    if (url && isValidUrl(url)) return url;
    return FALLBACK_IMAGE;
};
export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};
