import React, { useState } from 'react';
import { Upload, FileVideo, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onFileSelect: (file: File) => void;
}

export default function UploadDropzone({ onFileSelect }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl text-center space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
            Caption Cleaner
          </h1>
          <p className="text-xl text-neutral-400">
            Mark text overlays and blur them automatically. 100% private, processed in your browser.
          </p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            relative p-12 border-2 border-dashed rounded-3xl transition-all duration-300
            ${isDragging 
              ? 'border-blue-500 bg-blue-500/5 scale-102' 
              : 'border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900/80 hover:border-neutral-700'
            }
          `}
        >
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
            }}
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
              <Upload size={32} />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-medium text-white">Drop your video here</p>
              <p className="text-sm text-neutral-500">MP4, MOV, or WebM • Max 500MB</p>
            </div>
            <div className="mt-4 px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors">
              Select File
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <FeatureCard 
            icon={<FileVideo className="text-blue-400" size={20} />} 
            title="Full Quality" 
            desc="Exports in original resolution with high-bitrate H.264." 
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-green-400" size={20} />} 
            title="Private" 
            desc="Your video never leaves your computer." 
          />
          <FeatureCard 
            icon={<Upload className="text-purple-400" size={20} />} 
            title="Fast Local" 
            desc="Uses WebAssembly for near-native efficiency." 
          />
        </div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800 flex flex-col items-start text-left gap-3">
      <div className="p-3 rounded-lg bg-neutral-800/50">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-xs text-neutral-500 leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );
}
