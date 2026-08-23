export interface UploadInput { bytes: Buffer; mimeType: string; originalName: string }
export interface StoredObject { url: string; path: string; mimeType: string; sizeBytes: number }

export interface StorageAdapter {
  upload(input: UploadInput, folder: 'initial' | 'resolution'): Promise<StoredObject>;
}
