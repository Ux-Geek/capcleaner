import { useState } from "react";
import UploadDropzone from "./components/UploadDropzone";
import VideoEditor from "./components/VideoEditor";
import Logo from "./components/Logo";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-blue-500/30 pt-12 md:pt-20">
      <AnimatePresence mode="wait">
        <div className="max-w-7xl mx-auto px-6">
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-3 mb-12"
          >
            <Logo size={32} />
            <h1 className="text-xl font-medium tracking-tight">CapCleaner</h1>
          </motion.header>

          {!file ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <UploadDropzone onFileSelect={setFile} />
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen"
          >
            <VideoEditor 
              file={file} 
              onReset={() => setFile(null)} 
            />
          </motion.div>
            )}
        </div>
      </AnimatePresence>

      {/* Subtle Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>
    </main>
  );
}
