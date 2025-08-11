import { useState, useEffect, useRef } from 'react';

export function useGameTimer() {
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startTimer = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now();
      setIsRunning(true);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      const finalDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setDuration(finalDuration);
      return finalDuration;
    }
    return duration;
  };

  const resetTimer = () => {
    setDuration(0);
    setIsRunning(false);
    startTimeRef.current = 0;
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const currentDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDuration(currentDuration);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  return {
    duration,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
  };
}
