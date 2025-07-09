import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

const TrailerModal = ({ isOpen, onClose, trailer, title }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-1 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-dark-2">
          <h2 className="text-white text-xl font-semibold">{title} - Trailer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-dark-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <VideoPlayer
            url={trailer}
            title={`${title} Trailer`}
            type="trailer"
          />
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;