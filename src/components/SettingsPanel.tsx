import React from 'react';
import { Settings2 } from 'lucide-react';

export interface ConversionSettings {
  bitrate: string;
  sampleRate: string;
}

interface SettingsPanelProps {
  settings: ConversionSettings;
  onChange: (settings: ConversionSettings) => void;
  disabled?: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onChange, disabled }) => {
  return (
    <div className="glass rounded-xl p-5 w-full flex flex-col space-y-4">
      <div className="flex items-center space-x-2 text-slate-700 font-medium">
        <Settings2 className="w-5 h-5 text-blue-600" />
        <h3>Global Conversion Settings</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-slate-600">Audio Bitrate</label>
          <select 
            disabled={disabled}
            value={settings.bitrate}
            onChange={(e) => onChange({ ...settings, bitrate: e.target.value })}
            className="w-full bg-white border border-slate-300 text-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="128">128 kbps (Standard Quality)</option>
            <option value="192">192 kbps (High Quality)</option>
            <option value="256">256 kbps (Premium Quality)</option>
            <option value="320">320 kbps (Maximum Quality)</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-slate-600">Sample Rate</label>
          <select 
            disabled={disabled}
            value={settings.sampleRate}
            onChange={(e) => onChange({ ...settings, sampleRate: e.target.value })}
            className="w-full bg-white border border-slate-300 text-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="44100">44.1 kHz (CD Quality)</option>
            <option value="48000">48 kHz (DVD Quality)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
