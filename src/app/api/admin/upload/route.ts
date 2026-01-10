import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = file.name.replace(/[^a-zA-Z0-9.]/g, ''); // Sanitize
        const finalName = `${uniqueSuffix}-${filename}`;

        // Save to public/uploads
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadDir, finalName);

        try {
            await writeFile(filePath, buffer);
        } catch (err: any) {
            // If directory doesn't exist, create it (should ensure it exists, but just in case)
            if (err.code === 'ENOENT') {
                const fs = require('fs');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                    await writeFile(filePath, buffer);
                } else {
                    throw err;
                }
            } else {
                throw err;
            }
        }

        const imageUrl = `/uploads/${finalName}`;

        return NextResponse.json({ success: true, url: imageUrl });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
    }
}
