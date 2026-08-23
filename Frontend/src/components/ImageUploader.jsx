import React, { useRef } from 'react';
import { Camera, X, Image as ImageIcon, Upload } from 'lucide-react';

const SAMPLE_PHOTOS = [
  { label: 'Pothole', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop' },
  { label: 'Open Drain', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?q=80&w=800&auto=format&fit=crop' },
  { label: 'Garbage Dump', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=800&auto=format&fit=crop' }
];

export default function ImageUploader({ image, onChange, title = "Tap to add photo or take a picture" }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      {image ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-primary-500 shadow-md group max-h-64 bg-black">
          <img
            src={image}
            alt="Complaint preview"
            className="w-full h-56 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-3 right-3 bg-critical text-white p-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
            title="Remove Photo"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded text-xs flex items-center gap-1 font-mono">
            <Camera className="w-3 h-3 text-verified-glow" /> Photo Attached
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-primary-300 hover:border-primary-500 bg-primary-050/60 hover:bg-primary-100/50 rounded-2xl p-6 text-center cursor-pointer transition-all min-h-[200px] flex flex-col items-center justify-center gap-2 group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
          <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-primary-100 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
            <Camera className="w-7 h-7" />
          </div>
          <p className="font-display font-semibold text-neutral-900 text-sm mt-1">{title}</p>
          <p className="text-xs text-neutral-500">Supports Camera & Gallery Uploads</p>
        </div>
      )}

      {/* Preset Photo Selector for quick testing */}
      {!image && (
        <div className="bg-neutral-100 p-2.5 rounded-xl border border-neutral-200">
          <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <ImageIcon className="w-3 h-3" /> Quick Demo Sample Images:
          </p>
          <div className="flex gap-2">
            {SAMPLE_PHOTOS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(sample.url)}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-primary-050 border border-neutral-300 rounded text-xs font-display font-medium text-neutral-700 hover:text-primary-600 hover:border-primary-400 transition-all text-center truncate"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
