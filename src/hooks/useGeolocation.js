import { useState, useEffect } from 'react';

export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getGPSLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      // Fallback coordinates
      setLocation({ latitude: 11.0168, longitude: 76.9558, isFallback: true });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: parseFloat(position.coords.latitude.toFixed(4)),
          longitude: parseFloat(position.coords.longitude.toFixed(4)),
          isFallback: false
        });
        setLoading(false);
      },
      (err) => {
        console.warn('GPS error, using fallback location', err);
        setError('Location access denied or unavailable.');
        // Fallback default coordinates (Coimbatore / City Center)
        setLocation({ latitude: 11.0168, longitude: 76.9558, isFallback: true });
        setLoading(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    getGPSLocation();
  }, []);

  return { location, loading, error, retry: getGPSLocation, setLocation };
}
