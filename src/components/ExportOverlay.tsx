import { motion, AnimatePresence } from "motion/react";
import { Download } from "lucide-react";

interface ExportOverlayProps {
  exportUrl: string | null;
  fileName: string;
  onClose: () => void;
}

export default function ExportOverlay({
  exportUrl,
  fileName,
  onClose
}: ExportOverlayProps) {
  return (
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
            <div className="p-4 md:p-8 space-y-6 md:space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-white">Your Video is Clean!</h3>
                <p className="text-sm md:text-base text-neutral-400">The captions have been removed and blurred locally.</p>
              </div>

              <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-neutral-800">
                <video src={exportUrl} controls className="w-full h-full" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <a
                  href={exportUrl}
                  download={`cleaned-${fileName}`}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-white text-black font-bold rounded-2xl hover:bg-neutral-200 transition-all shadow-xl shadow-white/5"
                >
                  <Download size={20} />
                  <span className="hidden md:inline">Download Optimized MP4</span>
                  <span className="md:hidden">Download MP4</span>
                </a>
                <button 
                  onClick={onClose}
                  className="px-6 py-3 md:px-8 md:py-4 bg-neutral-800 text-white font-bold rounded-2xl hover:bg-neutral-700 transition-all"
                >
                  Back to Editor
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
