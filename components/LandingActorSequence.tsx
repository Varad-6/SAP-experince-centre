'use client';

import React, { useState, useCallback } from 'react';
import { ActorVideo } from './ActorVideo';
import siteData from '@/content/site.json';

interface LandingActorSequenceProps {
  onSequenceComplete?: () => void;
}

export const LandingActorSequence: React.FC<LandingActorSequenceProps> = ({
  onSequenceComplete,
}) => {
  const [currentAct, setCurrentAct] = useState<1 | 2 | 3>(1);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const introLines = siteData.introLines || [
    "Hello everyone! Parachuting is definitely my favorite adventure sport... but do you know what excites me even more?",
    "Exploring frontier technology, Generative AI, and predictive analytics! Let me walk you through the game-changing innovations Abhiyanta has built.",
    "Hi, I'm Aayam! We have engineered production-grade Clean Core solutions designed to modernize enterprise operations and shape the future of business.",
  ];

  const handleAct1End = useCallback(() => {
    setCurrentAct(2);
  }, []);

  const handleAct2End = useCallback(() => {
    setCurrentAct(3);
  }, []);

  const handleAct3End = useCallback(() => {
    setIsFinished(true);
    onSequenceComplete?.();
  }, [onSequenceComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-end">
      {/* 3-Act Video Stage */}
      <div
        className="absolute bottom-0 right-0 w-[clamp(380px,46vw,760px)] aspect-video"
        style={{
          transform: 'translateY(12px)',
        }}
      >
        {/* Act 1: Parachute Descent */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            currentAct === 1 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {currentAct <= 2 && (
            <ActorVideo
              name="intro_drop"
              bubbleText={introLines[0]}
              bubbleStartSec={1.0}
              holdLastFrame={false}
              onEnded={handleAct1End}
              muted={true}
              active={currentAct === 1}
              className="w-full h-full"
            />
          )}
        </div>

        {/* Act 2: Laptop & Holographic AI */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            currentAct === 2 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {currentAct >= 2 && currentAct <= 3 && (
            <ActorVideo
              name="analytics_laptop"
              bubbleText={introLines[1]}
              bubbleStartSec={0.8}
              holdLastFrame={false}
              onEnded={handleAct2End}
              muted={true}
              active={currentAct === 2}
              className="w-full h-full"
            />
          )}
        </div>

        {/* Act 3: Executive Aayam Greeting */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            currentAct === 3 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {currentAct === 3 && (
            <ActorVideo
              name="explain_close"
              bubbleText={introLines[2]}
              bubbleStartSec={isFinished ? 0 : 0.6}
              onEnded={handleAct3End}
              holdLastFrame={true}
              muted={true}
              active={currentAct === 3}
              className="w-full h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};
