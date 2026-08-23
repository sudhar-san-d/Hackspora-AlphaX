import { randomUUID } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { StorageAdapter, StoredObject, UploadInput } from './storage.js';

export class SupabaseStorage implements StorageAdapter {
  constructor(private readonly client: SupabaseClient) {}

  async upload(input: UploadInput, folder: 'initial' | 'resolution'): Promise<StoredObject> {
    const bucket = folder === 'initial' ? 'complaint-images' : 'resolution-images';
    const extension = input.mimeType === 'image/png' ? 'png' : input.mimeType === 'image/webp' ? 'webp' : 'jpg';
    const path = `${folder}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
    const { error } = await this.client.storage.from(bucket).upload(path, input.bytes, {
      contentType: input.mimeType,
      upsert: false,
      cacheControl: '3600',
    });
    if (error) throw new Error(`Evidence upload failed: ${error.message}`);
    const { data } = this.client.storage.from(bucket).getPublicUrl(path);
    return { path, url: data.publicUrl, mimeType: input.mimeType, sizeBytes: input.bytes.byteLength };
  }
}
