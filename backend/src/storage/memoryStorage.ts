import { randomUUID } from 'node:crypto';
import type { StorageAdapter, StoredObject, UploadInput } from './storage.js';

export class MemoryStorage implements StorageAdapter {
  async upload(input: UploadInput, folder: 'initial' | 'resolution'): Promise<StoredObject> {
    const extension = input.mimeType === 'image/png' ? 'png' : input.mimeType === 'image/webp' ? 'webp' : 'jpg';
    const path = `${folder}/${randomUUID()}.${extension}`;
    return {
      path,
      url: `data:${input.mimeType};base64,${input.bytes.toString('base64')}`,
      mimeType: input.mimeType,
      sizeBytes: input.bytes.byteLength,
    };
  }
}
