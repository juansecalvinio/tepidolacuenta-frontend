import { useState, useEffect } from "react";
import { useSound } from "../../hooks/useSound";

interface NotificationAlertProps {
  id: string;
  tableNumber?: number;
  message: string;
  onClose: (id: string) => void;
  autoClose?: boolean;
  duration?: number;
}

export const NotificationAlert = ({
  id,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
}: NotificationAlertProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [_, setProgress] = useState(100);

  const { play } = useSound("/sounds/notification.wav", { volume: 0.3 });

  useEffect(() => {
    // El componente se muestra inmediatamente cuando se monta
    play();
  }, [play]);

  useEffect(() => {
    if (!isVisible || !autoClose) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 100); // Disminuir cada 100ms
        return newProgress > 0 ? newProgress : 0;
      });
    }, 100);

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isVisible, autoClose, duration]);

  const handleClose = () => {
    setIsClosing(true);
    // Después de la animación (0.3s), ocultar completamente
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      onClose(id);
    }, 300);
  };

  if (!isVisible && !isClosing) {
    return null;
  }

  return (
    <div className="pointer-events-none">
      <div
        className={`pointer-events-auto max-w-sm w-full ${
          isClosing ? "animate-fade-out" : "animate-fade-in"
        }`}
      >
        <div className="alert alert-soft alert-success shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current h-6 w-6 shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h2 className="font-bold">{message}</h2>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
