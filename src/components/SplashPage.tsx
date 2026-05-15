import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface SplashPageProps {
  onComplete: () => void;
}

export default function SplashPage({ onComplete }: SplashPageProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 500);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative">
        {/* The Logo Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10"
        >
          <svg
            width="140"
            height="140"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M7.424 16L8.852 7.888H10.016L8.588 16H7.424ZM6.152 8.482L6.35 7.408H12.716L12.512 8.482H6.152ZM14.0854 16.198C13.5494 16.198 13.1354 16.03 12.8434 15.694C12.5554 15.358 12.4594 14.92 12.5554 14.38L13.7014 8.026H14.8414L13.7134 14.272C13.6614 14.568 13.6914 14.79 13.8034 14.938C13.9194 15.086 14.0894 15.16 14.3134 15.16C14.4294 15.16 14.5474 15.144 14.6674 15.112C14.7914 15.076 14.9074 15.034 15.0154 14.986C15.1234 14.938 15.1774 14.914 15.1774 14.914L15.3394 15.862C15.3394 15.862 15.2754 15.894 15.1474 15.958C15.0194 16.022 14.8634 16.078 14.6794 16.126C14.4994 16.174 14.3014 16.198 14.0854 16.198ZM12.0874 10.702L12.2674 9.682H16.2094L16.0294 10.702H12.0874Z"
              fill="white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            />
            <motion.path
              d="M11.02 19.5H7.5C6.88 19.5 6.33 19.48 5.84 19.41C3.21 19.12 2.5 17.88 2.5 14.5V9.5C2.5 6.12 3.21 4.88 5.84 4.59C6.33 4.52 6.88 4.5 7.5 4.5H10.96"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <motion.path
              d="M15.0195 4.5H16.4995C17.1195 4.5 17.6695 4.52 18.1595 4.59C20.7895 4.88 21.4995 6.12 21.4995 9.5V14.5C21.4995 17.88 20.7895 19.12 18.1595 19.41C17.6695 19.48 17.1195 19.5 16.4995 19.5H15.0195"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <motion.path
              d="M15 2V22"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>

        {/* The Mask Reveal Overlay */}
        <motion.div
          className="absolute inset-0 bg-neutral-950 z-20 pointer-events-none"
          initial={{ x: "0%" }}
          animate={{ x: isRevealed ? "100%" : "0%" }}
          transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
        />
        
        {/* Secondary decorative mask for cinematic effect */}
        <motion.div
          className="absolute inset-0 bg-blue-500/20 z-15 mix-blend-overlay pointer-events-none"
          initial={{ x: "-100%" }}
          animate={{ x: isRevealed ? "100%" : "-100%" }}
          transition={{ duration: 1.8, ease: [0.77, 0, 0.175, 1], delay: 0.1 }}
        />
      </div>

      {/* Background glow that pulses */}
      <motion.div 
        className="absolute w-[300px] h-[300px] bg-blue-600/20 blur-[100px] rounded-full z-0"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}
