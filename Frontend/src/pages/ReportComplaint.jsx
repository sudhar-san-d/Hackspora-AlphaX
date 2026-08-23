import React, { useState } from 'react';
import { ArrowLeft, Zap } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import LocationPicker from '../components/LocationPicker';

export default function ReportComplaint({ onBack, onSubmitComplaint }) {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = image && description.trim().length >= 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    await onSubmitComplaint({
      image_url: image,
      description: description.trim(),
      location: location || { latitude: 11.0168, longitude: 76.9558, address: 'Near Bus Stop, Sector 4' }
    });
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
          title="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-display font-bold text-xl text-neutral-900">
          Report a Problem
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Photo Upload */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            1. Photo Evidence *
          </label>
          <ImageUploader
            image={image}
            onChange={setImage}
            title="Tap to take or select a photo"
          />
        </div>

        {/* Step 2: Description */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            2. Describe the Problem *
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Large pothole near the bus stop causing severe traffic hazard..."
            className="input-field py-3 text-sm resize-none"
            required
          />
          {description.length > 0 && description.length < 10 && (
            <p className="text-[11px] text-high font-medium">
              Please enter at least 10 characters ({description.length}/10)
            </p>
          )}
        </div>

        {/* Step 3: Location */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            3. Issue Location
          </label>
          <LocationPicker
            value={location}
            onChange={setLocation}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`btn-primary w-full text-base py-4 ${
            !isValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Analyzing with AI...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-verified-glow" /> ANALYZE & SUBMIT
            </span>
          )}
        </button>

      </form>
    </div>
  );
}
