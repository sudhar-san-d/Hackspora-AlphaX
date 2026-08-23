import multer from 'multer';
import type { Request } from 'express';
import { AppError } from './errors.js';
import type { StorageAdapter, StoredObject, UploadInput } from '../storage/storage.js';

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function createUpload(maxBytes: number) {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxBytes, files: 1, fields: 30, fieldSize: 11_000_000 },
    fileFilter: (_request, file, callback) => allowedMimeTypes.has(file.mimetype)
      ? callback(null, true)
      : callback(new AppError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Only JPEG, PNG, and WebP images are accepted')),
  }).fields([{ name: 'image', maxCount: 1 }, { name: 'evidence', maxCount: 1 }]);
}

function hasValidSignature(bytes: Buffer, mimeType: string): boolean {
  if (mimeType === 'image/jpeg') return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mimeType === 'image/png') return bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (mimeType === 'image/webp') return bytes.length >= 12 && bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP';
  return false;
}

export function uploadedFile(request: Request): Express.Multer.File | undefined {
  const files = request.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  return files?.image?.[0] ?? files?.evidence?.[0];
}

export function validateUpload(input: UploadInput, maxBytes: number): void {
  if (!allowedMimeTypes.has(input.mimeType)) throw new AppError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Only JPEG, PNG, and WebP images are accepted');
  if (input.bytes.byteLength === 0 || input.bytes.byteLength > maxBytes) throw new AppError(413, 'FILE_TOO_LARGE', `Image must be between 1 and ${maxBytes} bytes`);
  if (!hasValidSignature(input.bytes, input.mimeType)) throw new AppError(400, 'INVALID_IMAGE', 'Image content does not match its declared MIME type');
}

export async function storeRequestImage(request: Request, dataUrl: string | undefined, storage: StorageAdapter, folder: 'initial' | 'resolution', maxBytes: number): Promise<StoredObject | null> {
  const file = uploadedFile(request);
  let input: UploadInput | null = null;
  if (file) input = { bytes: file.buffer, mimeType: file.mimetype, originalName: file.originalname };
  else if (dataUrl) {
    const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/i.exec(dataUrl);
    if (!match?.[1] || !match[2]) throw new AppError(400, 'INVALID_IMAGE', 'Malformed image data URL');
    input = { bytes: Buffer.from(match[2], 'base64'), mimeType: match[1].toLowerCase(), originalName: `upload.${match[1].split('/')[1]}` };
  }
  if (!input) return null;
  validateUpload(input, maxBytes);
  return storage.upload(input, folder);
}
