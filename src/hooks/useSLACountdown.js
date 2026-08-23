import { useState, useEffect } from 'react';

export function useSLACountdown(initialMinutes = 462) {
  const [minutesRemaining, setMinutesRemaining] = useState(initialMinutes);

  useEffect(() => {
    setMinutesRemaining(initialMinutes);
    const interval = setInterval(() => {
      setMinutesRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 60000); // update every minute

    return () => clearInterval(interval);
  }, [initialMinutes]);

  const hours = Math.floor(minutesRemaining / 60);
  const mins = minutesRemaining % 60;

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMins = String(mins).padStart(2, '0');

  const isBreached = minutesRemaining <= 0;
  const isUrgent = minutesRemaining > 0 && minutesRemaining <= 60;
  const isWarning = minutesRemaining > 60 && minutesRemaining <= 360;

  return {
    minutesRemaining,
    hours,
    mins,
    displayText: isBreached
      ? '⚠ SLA BREACHED'
      : `${formattedHours}h ${formattedMins}m remaining`,
    isBreached,
    isUrgent,
    isWarning
  };
}
