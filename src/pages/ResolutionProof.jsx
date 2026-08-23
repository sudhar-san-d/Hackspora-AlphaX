import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Camera, CheckCircle2 } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import EvidenceChecklist from '../components/EvidenceChecklist';
import LocationPicker from '../components/LocationPicker';

export default function ResolutionProof({ complaint, onBack, onSubmitEvidence }) {
  const [afterImage, setAfterImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isReady = !!afterImage;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isReady || isSubmitting) return;

    setIsSubmitting(true);
    await onSubmitEvidence(complaint.complaint_id, {
      image_url: afterImage,
      location: location || { latitude: 11.0169, longitude: 76.9559 },
      captured_at: new Date().toISOString()
    });
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-display font-bold text-lg text-neutral-900">
            Resolution Proof Upload
          </h2>
          <span className="font-mono text-xs text-primary-600 font-bold tracking-wider">
            {complaint?.complaint_id || 'CT-1001'} · {complaint?.issue || 'Pothole'}
          </span>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-primary-050 border border-primary-100 p-4 rounded-xl space-y-1 text-xs text-neutral-700">
        <div className="flex items-center gap-1.5 font-display font-bold text-primary-700">
          <ShieldCheck className="w-4 h-4 text-primary-500" /> Proof-of-Work Protocol
        </div>
        <p className="leading-relaxed">
          Upload a photo showing the completed repair work. The AI engine will verify location accuracy, timestamp, and before/after condition.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Photo Upload Zone */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Take After-Work Photo *
          </label>
          <ImageUploader
            image={afterImage}
            onChange={setAfterImage}
            title="Take photo of completed repair work"
          />
        </div>

        {/* GPS Capture */}
        <div className="space-y-2">
          <LocationPicker
            value={location}
            onChange={setLocation}
          />
        </div>

        {/* Evidence Checklist */}
        <EvidenceChecklist
          hasPhoto={!!afterImage}
          location={location || { latitude: 11.0169, longitude: 76.9559 }}
          timestamp={timestamp}
        />

        {/* Submit Action */}
        <button
          type="submit"
          disabled={!isReady || isSubmitting}
          className={`btn-primary w-full text-base py-4 bg-verified hover:bg-amber-800 ${
            !isReady || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Verifying Evidence with AI...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5 text-verified-glow" /> SUBMIT FOR VERIFICATION
            </span>
          )}
        </button>

      </form>
    </div>
  );
}
