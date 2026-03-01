import Tesseract from 'tesseract.js';
import axios from 'axios';
import fs from 'fs';
import os from 'os';
import path from 'path';

class TesseractService {
    /**
     * Extracts raw text from an image using Tesseract OCR.
     * Can handle both local file paths and remote URLs.
     */
    async extractTextFromImage(imageUrlOrPath: string): Promise<string> {
        try {
            console.log(`[Tesseract Service] Processing image: ${imageUrlOrPath}`);

            let targetPath = imageUrlOrPath;
            let tempFilePath: string | null = null;

            // If the path is a URL (like Cloudinary), Tesseract.js can theoretically handle it directly, 
            // but it's often more reliable to download it to a temp file first.
            if (imageUrlOrPath.startsWith('http://') || imageUrlOrPath.startsWith('https://')) {
                tempFilePath = path.join(os.tmpdir(), `tesseract_img_${Date.now()}.png`);
                const response = await axios.get(imageUrlOrPath, { responseType: 'arraybuffer' });
                fs.writeFileSync(tempFilePath, response.data);
                targetPath = tempFilePath;
            }

            // Run Tesseract OCR on the image
            const { data: { text } } = await Tesseract.recognize(
                targetPath,
                'eng', // Default language to English. Can be enhanced to support ['eng', 'hin', 'mar'].join('+') if needed.
                { logger: m => console.log(`[Tesseract] ${m.status}: ${Math.round(m.progress * 100)}%`) }
            );

            // Clean up temp file if we created one
            if (tempFilePath && fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }

            console.log(`[Tesseract Service] Extraction complete. Raw text length: ${text.length}`);
            return text;

        } catch (error) {
            console.error("[Tesseract Service] Error extracting text:", error);
            throw new Error("Failed to extract text using Tesseract OCR.");
        }
    }
}

export const tesseractService = new TesseractService();
