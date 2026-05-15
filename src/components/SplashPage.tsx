import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Logo from "./Logo";

interface SplashPageProps {
  onComplete: () => void;
}

export default function SplashPage({ onComplete }: SplashPageProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 800);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#f3f4f6] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Texture/Grain Overlay for premium feel */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative flex flex-col items-center">
        {/* Logo Container */}
        <div className="relative">
          <div className="z-10 relative">
            <Logo 
              isRevealed={isRevealed}
              size={140} 
            />
          </div>

          {/* Vertical Mask Reveal Panels */}
          <div className="absolute inset-0 z-20 flex flex-col pointer-events-none">
            <motion.div
              className="flex-1 bg-[#f3f4f6]"
              initial={{ height: "50%" }}
              animate={{ height: isRevealed ? "0%" : "50%" }}
              transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1] }}
            />
            <motion.div
              className="flex-1 bg-[#f3f4f6]"
              initial={{ height: "50%" }}
              animate={{ height: isRevealed ? "0%" : "50%" }}
              transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1] }}
            />
          </div>
        </div>

        {/* Text reveal */}
        <motion.div
          className="mt-8 overflow-hidden h-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.p 
            className="text-[#444444] font-medium tracking-[0.2em] text-sm uppercase"
            initial={{ y: 40 }}
            animate={{ y: isRevealed ? 0 : 40 }}
            transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
          >
            CapCleaner
          </motion.p>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-[#444444]/20"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 3, ease: "linear" }}
      />
    </motion.div>
  );
}
