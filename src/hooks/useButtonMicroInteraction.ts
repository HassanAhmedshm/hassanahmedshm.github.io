import { useCallback, useState, useRef } from 'react';

interface MicroInteractionHandlers {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  style?: React.CSSProperties;
}

export const useButtonMicroInteraction = (): MicroInteractionHandlers => {
  const [scale, setScale] = useState(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const onMouseEnter = useCallback(() => {
    setScale(1.05);
  }, []);

  const onMouseLeave = useCallback(() => {
    setScale(1);
  }, []);

  const onMouseDown = useCallback(() => {
    setScale(0.97);
  }, []);

  const onMouseUp = useCallback(() => {
    setScale(1.05);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setScale(1), 150);
  }, []);

  return {
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    style: { transform: `scale(${scale})`, transition: 'transform 0.15s ease' }
  };
};

export default useButtonMicroInteraction;
