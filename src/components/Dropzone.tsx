import React, { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '../lib/utils';

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFilesAdded, disabled }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragActive(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      // Optional: Filter for audio/video files if needed, here we take all and let FFmpeg try or validate
      onFilesAdded(droppedFiles);
    }
  }, [disabled, onFilesAdded]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(Array.from(e.target.files));
    }
    // reset input so the same file can be selected again
    e.target.value = '';
  }, [onFilesAdded]);

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center w-full h-64 p-6 border-2 border-dashed rounded-2xl transition-all duration-200 ease-in-out cursor-pointer overflow-hidden",
        isDragActive 
          ? "border-blue-500 bg-blue-50/50 scale-[1.02]" 
          : "border-slate-300 hover:border-blue-400 hover:bg-slate-50/50",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
    >
      <input
        type="file"
        multiple
        accept="audio/*,video/mpeg,video/mp2t,.mpg,.mpeg,.mp2,.mpga"
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        disabled={disabled}
      />
      
      <div className="flex flex-col items-center justify-center space-y-4 text-center pointer-events-none">
        <div className={cn(
          "p-4 rounded-full bg-blue-100 text-blue-600 transition-transform duration-300",
          isDragActive && "scale-110 shadow-lg bg-blue-200"
        )}>
          <UploadCloud className="w-10 h-10" />
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-700">
            Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
          </p>
          <p className="mt-2 text-sm text-slate-500">
            MPEG, MPG, MP2, MPGA up to any size (processed locally)
          </p>
        </div>
      </div>
    </div>
  );
};
