import { Plus, Trash2, LayoutTemplate, PanelTop, PanelBottom, Target } from "lucide-react";
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
    <aside className="w-full md:w-80 h-20 md:h-auto flex-shrink-0 border-t md:border-t-0 md:border-r border-neutral-800 bg-neutral-900/20 px-4 py-2 md:p-6 flex flex-row md:flex-col gap-4 md:gap-8 overflow-x-auto md:overflow-y-auto z-10 relative items-center md:items-stretch">
      <div className="flex flex-row md:flex-col items-center md:items-stretch gap-2 md:gap-4 shrink-0">
        <h2 className="hidden md:block text-xs font-bold text-neutral-500 uppercase tracking-widest px-2">Tools</h2>
        <button 
          onClick={onAddBox}
          title="Add Blur Zone"
          className="flex items-center justify-center md:justify-start gap-3 w-12 h-12 md:w-full md:h-auto md:px-4 md:py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white transition-all border border-neutral-700 shrink-0"
        >
          <Plus size={20} />
          <span className="hidden md:inline">Add Blur Zone</span>
        </button>
      </div>

      <div className="h-8 w-px md:w-full md:h-px bg-neutral-800 shrink-0 hidden md:block" />
      <div className="h-8 w-px bg-neutral-800 shrink-0 md:hidden" />

      <div className="flex flex-row md:flex-col items-center md:items-stretch gap-2 md:gap-4 shrink-0">
        <div className="hidden md:flex items-center justify-between px-2">
          <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Presets</h2>
          <LayoutTemplate size={20} className="w-3.5 h-3.5 text-neutral-500" />
        </div>
        <div className="flex flex-row md:grid md:grid-cols-1 gap-2">
          <button 
            onClick={() => onApplyTemplate('tiktok-top')}
            title="TikTok Top Header"
            className="flex items-center justify-center md:justify-start w-12 h-12 md:w-full md:h-auto md:px-4 md:py-2 hover:bg-neutral-800 rounded-lg md:text-sm text-neutral-400 hover:text-white transition-colors shrink-0"
          >
            <PanelTop size={20} className="md:hidden" />
            <span className="hidden md:inline">TikTok Top Header</span>
          </button>
          <button 
            onClick={() => onApplyTemplate('tiktok-bottom')}
            title="TikTok Bottom Caption"
            className="flex items-center justify-center md:justify-start w-12 h-12 md:w-full md:h-auto md:px-4 md:py-2 hover:bg-neutral-800 rounded-lg md:text-sm text-neutral-400 hover:text-white transition-colors shrink-0"
          >
            <PanelBottom size={20} className="md:hidden" />
            <span className="hidden md:inline">TikTok Bottom Caption</span>
          </button>
          <button 
            onClick={() => onApplyTemplate('reels')}
            title="Center Overlay"
            className="flex items-center justify-center md:justify-start w-12 h-12 md:w-full md:h-auto md:px-4 md:py-2 hover:bg-neutral-800 rounded-lg md:text-sm text-neutral-400 hover:text-white transition-colors shrink-0"
          >
            <Target size={20} className="md:hidden" />
            <span className="hidden md:inline">Center Overlay</span>
          </button>
        </div>
      </div>

      <div className="h-8 w-px bg-neutral-800 shrink-0 md:hidden" />

      <div className="flex flex-row md:flex-col items-center md:items-stretch gap-2 md:gap-4 flex-1 md:flex-none">
        <h2 className="hidden md:block text-xs font-bold text-neutral-500 uppercase tracking-widest px-2">Active Zones</h2>
        <div className="flex flex-row md:flex-col gap-2 min-w-max md:min-w-0 pb-1 md:pb-0">
          <AnimatePresence>
            {boxes.map((box, idx) => (
              <motion.div
                key={box.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`
                  group flex items-center justify-center md:justify-between w-12 h-12 md:w-full md:h-auto md:p-2 md:px-4 md:py-3 rounded-xl border transition-all cursor-pointer relative shrink-0
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
                  className="absolute -top-1 -right-1 md:relative md:top-auto md:right-auto p-1 md:p-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 bg-red-500 md:bg-transparent text-white md:hover:bg-red-500/20 md:hover:text-red-500 rounded-full md:rounded-md transition-all z-20 shadow-md md:shadow-none"
                >
                  <Trash2 size={12} className="md:w-4 md:h-4" />
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
