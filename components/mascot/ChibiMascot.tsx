'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';

export type MascotPose = 'standing' | 'pointing' | 'explaining';

interface ChibiMascotProps {
  initialPose?: MascotPose;
  message?: string;
  solutionName?: string;
  visible?: boolean;
  onDismiss?: () => void;
}

export const ChibiMascot: React.FC<ChibiMascotProps> = ({
  initialPose = 'standing',
  message = "Welcome to the AIS Experience Centre! I'm your digital architecture guide. Explore our 28 enterprise solutions below!",
  solutionName,
  visible = true,
  onDismiss
}) => {
  const [pose, setPose] = useState<MascotPose>(initialPose);
  const [currentMessage, setCurrentMessage] = useState(message);
  const [isBubbleOpen, setIsBubbleOpen] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    setPose(initialPose);
  }, [initialPose]);

  useEffect(() => {
    setCurrentMessage(message);
    setIsBubbleOpen(true);
  }, [message]);

  const poseImageMap = {
    standing: '/mascot/mascot_standing.png',
    pointing: '/mascot/mascot_pointing.png',
    explaining: '/mascot/mascot_explaining.png',
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none select-none">
      {/* Speech Bubble */}
      <AnimatePresence>
        {isBubbleOpen && !minimized && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="mb-3 max-w-sm pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 relative"
          >
            {/* Bubble arrow pointing down */}
            <div className="absolute -bottom-2 right-12 w-4 h-4 bg-white dark:bg-slate-900 transform rotate-45 border-r border-b border-slate-200 dark:border-slate-800" />

            {/* Bubble Header */}
            <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sap-blue">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Lead Architect Guide</span>
                {solutionName && (
                  <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-mono text-[10px]">
                    {solutionName}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? 'Mute' : 'Enable voice read'}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-sap-blue" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsBubbleOpen(false)}
                  title="Close tip"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Message Body */}
            <p className="text-xs leading-relaxed font-medium">
              {currentMessage}
            </p>

            {/* Quick Pose Switchers for Demo */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
              <span>Pose:</span>
              <div className="flex gap-1">
                {(['standing', 'pointing', 'explaining'] as MascotPose[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPose(p)}
                    className={`px-2 py-0.5 rounded capitalize transition font-medium ${
                      pose === p
                        ? 'bg-sap-blue text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Character Avatar */}
      <motion.div
        drag
        dragConstraints={{ left: -300, right: 0, top: -400, bottom: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative pointer-events-auto cursor-grab active:cursor-grabbing group"
      >
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-sap-blue/20 to-cyan-400/20 rounded-full blur-xl transform group-hover:scale-125 transition duration-500" />

        {/* Character Image */}
        <motion.img
          key={pose}
          initial={{ opacity: 0.8, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          src={poseImageMap[pose]}
          alt="AIS Lead Architect Mascot"
          className="w-36 h-auto drop-shadow-2xl relative z-10 filter"
          onClick={() => {
            if (minimized) {
              setMinimized(false);
              setIsBubbleOpen(true);
            } else {
              setIsBubbleOpen(!isBubbleOpen);
            }
          }}
        />

        {/* Floating Mini Action Toggle */}
        <button
          onClick={() => setMinimized(!minimized)}
          title={minimized ? 'Expand Mascot' : 'Minimize Mascot'}
          className="absolute -top-1 -right-1 z-20 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-500 hover:text-sap-blue transition"
        >
          {minimized ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        </button>
      </motion.div>
    </div>
  );
};

export default ChibiMascot;
