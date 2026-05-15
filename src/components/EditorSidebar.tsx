import { Plus, Trash2, LayoutTemplate } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { RemovalBox } from "../types/editor";

interface EditorSidebarProps {
  boxes: RemovalBox[];
  selectedId: string | null;
  onAddBox: () => void;
  onRemoveBox: (id: string) => void;
  onSelectBox: (id: string) => void;
  onApplyTemplate: (type: 'tiktok-top' | 'tiktok-bottom' | 'reels') => void;
}

export default function EditorSidebar({
  boxes,
  selectedId,
  onAddBox,
  onRemoveBox,
  onSelectBox,
  onApplyTemplate
}: EditorSidebarProps) {
  return (
    <aside className="w-16 md:w-80 flex-shrink-0 border-r border-neutral-800 bg-neutral-900/20 p-2 md:p-6 flex flex-col gap-8 overflow-y-auto z-10 relative">
      <div className="space-y-4">
        <h2 className="hidden md:block text-xs font-bold text-neutral-500 uppercase tracking-widest px-2">Tools</h2>
        <button 
          onClick={onAddBox}
          title="Add Blur Zone"
          className="w-full flex items-center justify-center md:justify-start gap-3 p-3 md:px-4 md:py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white transition-all border border-neutral-700"
        >
          <Plus size={20} />
          <span className="hidden md:inline">Add Blur Zone</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center md:justify-between px-2">
          <h2 className="hidden md:block text-xs font-bold text-neutral-500 uppercase tracking-widest">Presets</h2>
          <LayoutTemplate size={20} className="md:w-3.5 md:h-3.5 text-neutral-500" />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <button 
            onClick={() => onApplyTemplate('tiktok-top')}
            title="TikTok Top Header"
            className="w-full flex justify-center md:justify-start px-2 py-2 md:px-4 md:py-2 hover:bg-neutral-800 rounded-lg text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <span className="hidden md:inline">TikTok Top Header</span>
            <span className="md:hidden text-xs font-bold">TOP</span>
          </button>
          <button 
            onClick={() => onApplyTemplate('tiktok-bottom')}
            title="TikTok Bottom Caption"
            className="w-full flex justify-center md:justify-start px-2 py-2 md:px-4 md:py-2 hover:bg-neutral-800 rounded-lg text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <span className="hidden md:inline">TikTok Bottom Caption</span>
            <span className="md:hidden text-xs font-bold">BOT</span>
          </button>
          <button 
            onClick={() => onApplyTemplate('reels')}
            title="Center Overlay"
            className="w-full flex justify-center md:justify-start px-2 py-2 md:px-4 md:py-2 hover:bg-neutral-800 rounded-lg text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <span className="hidden md:inline">Center Overlay</span>
            <span className="md:hidden text-xs font-bold">MID</span>
          </button>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <h2 className="hidden md:block text-xs font-bold text-neutral-500 uppercase tracking-widest px-2">Active Zones</h2>
        <div className="space-y-2">
          <AnimatePresence>
            {boxes.map((box, idx) => (
              <motion.div
                key={box.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`
                  group flex items-center justify-center md:justify-between p-2 md:px-4 md:py-3 rounded-xl border transition-all cursor-pointer relative
                  ${selectedId === box.id 
                    ? 'bg-blue-500/10 border-blue-500/50' 
                    : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }
                `}
                onClick={() => onSelectBox(box.id)}
                title={`Zone #${idx + 1}`}
              >
                <span className="hidden md:inline text-sm text-white">Zone #{idx + 1}</span>
                <span className="md:hidden text-xs font-bold">{idx + 1}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemoveBox(box.id); }}
                  className="absolute right-0 md:relative p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-500 rounded-md transition-all md:translate-x-0 translate-x-[110%]"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {boxes.length === 0 && (
            <div className="hidden md:block text-center py-8 px-4 rounded-2xl border border-dotted border-neutral-800 text-neutral-600 text-sm italic">
              No zones added yet.
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
