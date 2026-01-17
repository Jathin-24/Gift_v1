import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const FALLBACK_IMAGE = "https://images.pexels.com/photos/6204562/pexels-photo-6204562.jpeg?auto=compress&cs=tinysrgb&w=800";

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
