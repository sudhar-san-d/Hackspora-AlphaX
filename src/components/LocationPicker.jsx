import React, { useState } from 'react';
import { MapPin, CheckCircle2, RefreshCw, Navigation } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';

export default function LocationPicker({ value, onChange }) {
  const { location, loading, error, retry } = useGeolocation();
  const [manualMode, setManualMode] = useState(false);
  const [manualAddress, setManualAddress] = useState('');

  const currentLocation = value || location;

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualAddress.trim()) {
      onChange({
        latitude: 11.0168,
        longitude: 76.9558,
        address: manualAddress.trim()
      });
      setManualMode(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 uppercase tracking-wider">
        <span>📍 GPS Location</span>
        {!manualMode && (
          <button
            type="button"
            onClick={() => setManualMode(true)}
            className="text-primary-500 hover:underline capitalize"
          >
            Enter manually
          </button>
        )}
      </div>

      {manualMode ? (
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Near Bus Stop, Sector 4"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            className="input-field py-2 text-sm flex-1"
          />
          <button type="submit" className="btn-primary py-2 px-4 text-xs min-h-[44px]">
            Set
          </button>
        </form>
      ) : loading ? (
        <div className="flex items-center gap-2 p-3 bg-neutral-100 rounded-lg text-neutral-500 text-sm animate-pulse border border-neutral-200">
          <Navigation className="w-4 h-4 text-primary-500 animate-spin" />
          <span>Detecting location via GPS...</span>
        </div>
      ) : currentLocation ? (
        <div className="flex items-center justify-between p-3 bg-success-bg border border-green-200 rounded-lg text-success text-sm font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
            <span className="font-semibold text-xs text-neutral-900">
              {currentLocation.address || `${currentLocation.latitude}, ${currentLocation.longitude}`}
            </span>
          </div>
          <button
            type="button"
            onClick={retry}
            className="p-1 hover:bg-green-100 rounded text-neutral-500 hover:text-neutral-900 transition-colors"
            title="Refresh GPS"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-warning-bg border border-warning/30 rounded-lg text-warning text-xs">
          <span>{error || 'Location unavailable'}</span>
          <button
            type="button"
            onClick={retry}
            className="btn-secondary py-1 px-3 text-xs min-h-[32px]"
          >
            Retry GPS
          </button>
        </div>
      )}
    </div>
  );
}
