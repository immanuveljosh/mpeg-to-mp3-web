import { useState, useCallback, useEffect } from 'react';
import { convertMpegToMp3, getFFmpeg } from '../lib/ffmpeg';

export type ConversionStatus = 'idle' | 'converting' | 'success' | 'error';

export interface AudioFile {
  id: string;
  file: File;
  originalName: string;
  outputName: string;
  size: number;
  status: ConversionStatus;
  progress: number;
  blobUrl?: string;
  error?: string;
}

export const useConverter = () => {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize FFmpeg on mount
  useEffect(() => {
    const init = async () => {
      try {
        await getFFmpeg();
        setIsReady(true);
      } catch (err) {
        console.error("Failed to load FFmpeg", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    const newAudioFiles: AudioFile[] = newFiles.map((file) => {
      // Default output name logic: replace extension with .mp3
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      return {
        id: crypto.randomUUID(),
        file,
        originalName: file.name,
        outputName: `${nameWithoutExt}.mp3`,
        size: file.size,
        status: 'idle',
        progress: 0,
      };
    });
    setFiles((prev) => [...prev, ...newAudioFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.blobUrl) {
        URL.revokeObjectURL(target.blobUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((f) => {
        if (f.blobUrl) URL.revokeObjectURL(f.blobUrl);
      });
      return [];
    });
  }, []);

  const updateFileName = useCallback((id: string, newName: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          // ensure it has .mp3
          const name = newName.endsWith('.mp3') ? newName : `${newName}.mp3`;
          return { ...f, outputName: name };
        }
        return f;
      })
    );
  }, []);

  const convertFile = useCallback(async (id: string, bitrate: string, sampleRate: string) => {
    const targetFile = files.find(f => f.id === id);
    if (!targetFile) return;

    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'converting', progress: 0, error: undefined } : f));

    try {
      // Track progress
      const onProgress = (ratio: number) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: Math.round(ratio * 100) } : f));
      };

      const blob = await convertMpegToMp3(targetFile.file, bitrate, sampleRate, onProgress);
      const blobUrl = URL.createObjectURL(blob);

      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'success', progress: 100, blobUrl } : f));
    } catch (error: any) {
      console.error(error);
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', progress: 0, error: error.message || 'Conversion failed' } : f));
    }
  }, [files]);

  return {
    files,
    isReady,
    isLoading,
    addFiles,
    removeFile,
    clearAll,
    updateFileName,
    convertFile,
  };
};
