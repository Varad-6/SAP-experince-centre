import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseTypewriterOptions {
  speed?: number;
  delay?: number;
  onComplete?: () => void;
}

export function useTypewriter(
  text: string,
  options: UseTypewriterOptions = {}
) {
  const { speed = 28, delay = 0, onComplete } = options;
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const finish = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setShown(text);
    setDone(true);
    if (onComplete) onComplete();
  }, [text, onComplete]);

  useEffect(() => {
    setShown('');
    setDone(false);

    timeoutRef.current = setTimeout(() => {
      let currentIdx = 0;
      intervalRef.current = setInterval(() => {
        currentIdx++;
        setShown(text.slice(0, currentIdx));
        if (currentIdx >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDone(true);
          if (onComplete) onComplete();
        }
      }, speed);
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, delay, onComplete]);

  return { shown, done, finish };
}
