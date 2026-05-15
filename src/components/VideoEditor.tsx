import { useState, useRef, useMemo, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { 
  Play, 
  Pause, 
  ArrowLeft, 
  Loader2, 
  Sparkles
} from "lucide-react";
import type { RemovalBox, VideoDimensions } from "../types/editor";
import { exportCleanVideo } from "../lib/exportVideo";
import DraggableBox from "./DraggableBox";
import EditorSidebar from "./EditorSidebar";
import ExportOverlay from "./ExportOverlay";

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
      <header className="h-14 md:h-16 border-b border-neutral-800 flex items-center justify-between px-2 md:px-6 bg-neutral-900/50 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          <button 
            onClick={onReset}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-4 w-[1px] bg-neutral-800 shrink-0" />
          <h1 className="font-semibold text-white tracking-tight truncate text-sm md:text-base">
            {file.name}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-2 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            {isExporting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Sparkles size={16} />
            )}
            <span className="hidden md:inline">
              {isExporting ? `Exporting ${exportProgress}%` : "Export Clean Video"}
            </span>
            <span className="md:hidden">
              {isExporting ? `${exportProgress}%` : "Export"}
            </span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden flex-col-reverse md:flex-row">
        {/* Editor Sidebar */}
        <EditorSidebar 
          boxes={boxes}
          selectedId={selectedId}
          onAddBox={addBox}
          onRemoveBox={removeBox}
          onSelectBox={setSelectedId}
          onApplyTemplate={applyTemplate}
        />

        {/* Editor Stage */}
        <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] from-neutral-900/50 relative">
          <div ref={containerRef} className="relative w-full max-w-full h-full max-h-full flex items-center justify-center rounded-lg md:rounded-2xl overflow-hidden shadow-2xl bg-black border border-neutral-800">
            <video
              ref={videoRef}
              src={videoUrl}
              onLoadedMetadata={handleLoadedMetadata}
              className="max-h-full max-w-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              playsInline
            />
            {previewDims && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
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
                  onTouchStart={(e) => {
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
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 md:px-6 md:py-3 rounded-full bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/50 shadow-2xl opacity-0 hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={togglePlay}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause size={16} className="md:w-5 md:h-5" /> : <Play size={16} className="md:w-5 md:h-5" fill="currentColor" />}
              </button>
            </div>
          </div>

          <div className="mt-2 md:mt-8 text-center max-w-md hidden md:block">
            <p className="text-neutral-500 text-xs md:text-sm">
              Press <span className="text-neutral-300 font-mono">SPACE</span> to play/pause. Drag boxes to mark text. Use handles to resize.
            </p>
          </div>
        </div>
      </main>

      {/* Export Overlay */}
      <ExportOverlay 
        exportUrl={exportUrl}
        fileName={file.name}
        onClose={() => setExportUrl(null)}
      />
    </div>
  );
}
