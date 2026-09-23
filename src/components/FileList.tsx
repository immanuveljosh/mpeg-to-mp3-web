import React from 'react';
import type { AudioFile } from '../hooks/useConverter';
import { Download, Play, Trash2, CheckCircle2, AlertCircle, Loader2, Music } from 'lucide-react';
import type { ConversionSettings } from './SettingsPanel';

interface FileListProps {
  files: AudioFile[];
  settings: ConversionSettings;
  onConvert: (id: string, bitrate: string, sampleRate: string) => void;
  onRemove: (id: string) => void;
  onUpdateName: (id: string, newName: string) => void;
  disabled?: boolean;
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const FileList: React.FC<FileListProps> = ({ 
  files, 
  settings, 
  onConvert, 
  onRemove, 
  onUpdateName,
  disabled 
}) => {
  if (files.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      {files.map((file) => (
        <div key={file.id} className="glass rounded-xl p-4 sm:p-5 flex flex-col gap-4 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
            
            {/* File Info */}
            <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg text-white flex-shrink-0">
                <Music className="w-6 h-6" />
              </div>
              <div className="flex flex-col overflow-hidden w-full">
                <span className="font-medium text-slate-800 truncate" title={file.originalName}>
                  {file.originalName}
                </span>
                <span className="text-sm text-slate-500">{formatSize(file.size)}</span>
              </div>
            </div>

            {/* Actions & Status */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {file.status === 'idle' && (
                <button
                  onClick={() => onConvert(file.id, settings.bitrate, settings.sampleRate)}
                  disabled={disabled}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4 fill-current" /> Convert
                </button>
              )}

              {file.status === 'converting' && (
                <div className="flex items-center gap-2 text-blue-600 px-4 py-2 bg-blue-50 rounded-lg">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">{file.progress}%</span>
                </div>
              )}

              {file.status === 'success' && file.blobUrl && (
                <a
                  href={file.blobUrl}
                  download={file.outputName}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" /> Download
                </a>
              )}

              {file.status === 'error' && (
                <div className="flex items-center gap-2 text-red-500 px-3 py-2 bg-red-50 rounded-lg" title={file.error}>
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:inline">Failed</span>
                </div>
              )}

              <button
                onClick={() => onRemove(file.id)}
                disabled={file.status === 'converting'}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Remove file"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings & Progress Row */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600 w-16">Save as:</span>
              <input
                type="text"
                value={file.outputName}
                onChange={(e) => onUpdateName(file.id, e.target.value)}
                disabled={file.status !== 'idle' || disabled}
                className="flex-1 bg-white/50 border border-slate-200 rounded p-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow disabled:opacity-50 disabled:bg-slate-50"
              />
            </div>
            
            {/* Progress Bar */}
            {file.status === 'converting' && (
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${file.progress}%` }}
                />
              </div>
            )}
            {file.status === 'success' && (
              <div className="flex items-center gap-1.5 mt-2 text-emerald-600 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" /> Conversion complete!
              </div>
            )}
            {file.status === 'error' && (
              <div className="mt-1 text-red-500 text-xs">
                {file.error}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
