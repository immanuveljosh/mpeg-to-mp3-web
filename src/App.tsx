import { useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Dropzone } from './components/Dropzone';
import { SettingsPanel, type ConversionSettings } from './components/SettingsPanel';
import { FileList } from './components/FileList';
import { useConverter } from './hooks/useConverter';

function App() {
  const {
    files,
    isReady,
    isLoading,
    addFiles,
    removeFile,
    clearAll,
    updateFileName,
    convertFile,
  } = useConverter();

  const [settings, setSettings] = useState<ConversionSettings>({
    bitrate: '192',
    sampleRate: '44100',
  });

  const hasFiles = files.length > 0;
  const isConverting = files.some((f) => f.status === 'converting');

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
            MPEG to MP3 Converter
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Fast, high-quality audio conversion that happens entirely inside your browser. No limits, no sign-ups.
          </p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
            Your files stay on your device. 100% Private.
          </div>
        </div>

        {/* FFmpeg Loading State */}
        {isLoading && (
          <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 text-blue-600">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="text-lg font-medium">Loading local conversion engine...</p>
          </div>
        )}

        {!isLoading && !isReady && (
          <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 text-red-500 border-red-200">
            <p className="text-lg font-medium text-center">
              Failed to load conversion engine. This browser might not be supported or requires special headers (COOP/COEP).
            </p>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && isReady && (
          <div className="space-y-6">
            <Dropzone onFilesAdded={addFiles} disabled={isConverting} />

            {hasFiles && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Settings */}
                <div className="lg:col-span-4">
                  <SettingsPanel 
                    settings={settings} 
                    onChange={setSettings} 
                    disabled={isConverting} 
                  />
                </div>

                {/* File List */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Your Files</h2>
                    <button
                      onClick={clearAll}
                      disabled={isConverting}
                      className="text-sm font-medium text-slate-500 hover:text-red-500 disabled:opacity-50 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <FileList
                    files={files}
                    settings={settings}
                    onConvert={convertFile}
                    onRemove={removeFile}
                    onUpdateName={updateFileName}
                    disabled={isConverting}
                  />
                </div>
              </div>
            )}
          </div>
        )}

      </div>
      
      {/* Footer Contact Info */}
      <div className="fixed bottom-4 left-4 z-50 text-xs text-slate-500 bg-white/60 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-200 shadow-sm max-w-[250px] sm:max-w-none">
        If there are any issues, please contact Senior Web Developer Immanuel
      </div>
    </div>
  );
}

export default App;
