import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const Toast = ({ message, type = 'success', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-purple-600',
    error: 'bg-red-600',
    warning: 'bg-orange-600',
    info: 'bg-purple-600',
  }[type];

  return (
    <div
      className={`fixed top-5 right-5 ${bgColor} text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 animate-slideIn z-9999 border border-purple-500/30 backdrop-blur-sm`}
    >
      <span className="flex-1">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        className="text-white hover:opacity-80 transition-opacity"
      >
        <FiX size={18} />
      </button>
    </div>
  );
};

export default Toast;
