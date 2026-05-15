import { useState, useRef, useMemo, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  ArrowLeft, 
  Download, 
  Loader2, 
  Sparkles,
  LayoutTemplate
} from "lucide-react";
import type { RemovalBox, VideoDimensions } from "../types/editor";
import { exportCleanVideo } from "../lib/exportVideo";
import DraggableBox from "./DraggableBox";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  file: File;
  onReset: () => void;
}

export default function VideoEditor({ file, onReset }: Props) {
  const [boxes, setBoxes] = useState<RemovalBox[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [videoDims, setVideoDims] = useState<VideoDimensions | null>(null);
  const [previewDims, setPreviewDims] = useState<VideoDimensions | null>(null);

  const videoUrl = useMemo(() => URL.createObjectURL(file), [file]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDims({
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      });
      updatePreviewDims();
    }
  };

  const updatePreviewDims = () => {
    if (videoRef.current) {
      const { clientWidth, clientHeight } = videoRef.current;
      setPreviewDims({ width: clientWidth, height: clientHeight });
    }
  };

  useEffect(() => {
    window.addEventListener('resize', updatePreviewDims);
    return () => window.removeEventListener('resize', updatePreviewDims);
  }, []);

  const addBox = () => {
    const newBox: RemovalBox = {
      id: crypto.randomUUID(),
      x: 50,
      y: 50,
      width: 150,
      height: 60,
      mode: "blur",
    };
    setBoxes([...boxes, newBox]);
    setSelectedId(newBox.id);
  };

  const removeBox = (id: string) => {
    setBoxes(boxes.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const applyTemplate = (type: 'tiktok-top' | 'tiktok-bottom' | 'reels') => {
    if (!previewDims) return;
    const { width, height } = previewDims;
    
    let template: RemovalBox;
    if (type === 'tiktok-top') {
      template = {
        id: crypto.randomUUID(),
        x: width * 0.1,
        y: height * 0.1,
        width: width * 0.8,
        height: height * 0.1,
        mode: "blur"
      };
    } else if (type === 'tiktok-bottom') {
      template = {
        id: crypto.randomUUID(),
        x: width * 0.1,
        y: height * 0.8,
        width: width * 0.8,
        height: height * 0.1,
        mode: "blur"
      };
    } else {
       template = {
        id: crypto.randomUUID(),
        x: width * 0.2,
        y: height * 0.4,
        width: width * 0.6,
        height: height * 0.2,
        mode: "blur"
      };
    }
    setBoxes([...boxes, template]);
    setSelectedId(template.id);
  };

  const handleExport = async () => {
    if (!videoDims || !previewDims) return;
    setIsExporting(true);
    setExportProgress(0);
    try {
      const url = await exportCleanVideo(
        file, 
        boxes, 
        previewDims, 
        videoDims,
        (p) => setExportProgress(Math.round(p * 100))
      );
      setExportUrl(url);
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to export video. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-950 overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-900/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onReset}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-4 w-[1px] bg-neutral-800" />
          <h1 className="font-semibold text-white tracking-tight">
            {file.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Sparkles size={18} />
            )}
            {isExporting ? `Exporting ${exportProgress}%` : "Export Clean Video"}
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 border-r border-neutral-800 bg-neutral-900/20 p-6 flex flex-col gap-8 overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest px-2">Tools</h2>
            <button 
              onClick={addBox}
              className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white transition-all border border-neutral-700"
            >
              <Plus size={20} />
              <span>Add Blur Zone</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Presets</h2>
              <LayoutTemplate size={14} className="text-neutral-500" />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => applyTemplate('tiktok-top')}
                className="w-full text-left px-4 py-2 hover:bg-neutral-800 rounded-lg text-sm text-neutral-400 hover:text-white transition-colors"
              >
                TikTok Top Header
              </button>
              <button 
                onClick={() => applyTemplate('tiktok-bottom')}
                className="w-full text-left px-4 py-2 hover:bg-neutral-800 rounded-lg text-sm text-neutral-400 hover:text-white transition-colors"
              >
                TikTok Bottom Caption
              </button>
              <button 
                onClick={() => applyTemplate('reels')}
                className="w-full text-left px-4 py-2 hover:bg-neutral-800 rounded-lg text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Center Overlay
              </button>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest px-2">Active Zones</h2>
            <div className="space-y-2">
              <AnimatePresence>
                {boxes.map((box, idx) => (
                  <motion.div
                    key={box.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={`
                      group flex items-center justify-between px-4 py-3 rounded-xl border transition-all cursor-pointer
                      ${selectedId === box.id 
                        ? 'bg-blue-500/10 border-blue-500/50' 
                        : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                      }
                    `}
                    onClick={() => setSelectedId(box.id)}
                  >
                    <span className="text-sm text-white">Zone #{idx + 1}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeBox(box.id); }}
                      className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-500 rounded-md transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {boxes.length === 0 && (
                <div className="text-center py-8 px-4 rounded-2xl border border-dotted border-neutral-800 text-neutral-600 text-sm italic">
                  No zones added yet.
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Editor Stage */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] from-neutral-900/50">
          <div ref={containerRef} className="relative max-w-full max-h-full aspect-auto rounded-2xl overflow-hidden shadow-2xl bg-black border border-neutral-800">
            <video
              ref={videoRef}
              src={videoUrl}
              onLoadedMetadata={handleLoadedMetadata}
              className="max-h-[70vh] w-auto display-block"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            {previewDims && (
              <div className="absolute inset-0 pointer-events-none">
                <Stage 
                  width={previewDims.width} 
                  height={previewDims.height}
                  className="pointer-events-auto"
                  onMouseDown={(e) => {
                    // deselect when clicked on empty area
                    const clickedOnEmpty = e.target === e.target.getStage();
                    if (clickedOnEmpty) {
                      setSelectedId(null);
                    }
                  }}
                >
                  <Layer>
                    {boxes.map((box) => (
                      <DraggableBox
                        key={box.id}
                        box={box}
                        isSelected={box.id === selectedId}
                        onSelect={setSelectedId}
                        onChange={(newAttrs) => {
                          setBoxes(boxes.map((b) => b.id === newAttrs.id ? newAttrs : b));
                        }}
                      />
                    ))}
                  </Layer>
                </Stage>
              </div>
            )}

            {/* In-Video Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-full bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/50 shadow-2xl opacity-0 hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={togglePlay}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
              </button>
            </div>
          </div>

          <div className="mt-8 text-center max-w-md">
            <p className="text-neutral-500 text-sm">
              Press <span className="text-neutral-300 font-mono">SPACE</span> to play/pause. Drag boxes to mark text. Use handles to resize.
            </p>
          </div>
        </div>
      </main>

      {/* Export Overlay */}
      <AnimatePresence>
        {exportUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-2xl bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-white">Your Video is Clean!</h3>
                  <p className="text-neutral-400">The captions have been removed and blurred locally.</p>
                </div>

                <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-neutral-800">
                  <video src={exportUrl} controls className="w-full h-full" />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={exportUrl}
                    download={`cleaned-${file.name}`}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-neutral-200 transition-all shadow-xl shadow-white/5"
                  >
                    <Download size={20} />
                    Download Optimized MP4
                  </a>
                  <button 
                    onClick={() => setExportUrl(null)}
                    className="px-8 py-4 bg-neutral-800 text-white font-bold rounded-2xl hover:bg-neutral-700 transition-all"
                  >
                    Back to Editor
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
