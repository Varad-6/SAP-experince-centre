'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChromaKeyCanvas } from '@/components/ChromaKeyCanvas';
import { ACTOR_VIDEOS, ActorVideoName } from '@/components/ActorVideo';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Play, Pause } from 'lucide-react';

function KeyTunerContent() {
  const searchParams = useSearchParams();
  const videoParam = (searchParams.get('video') as ActorVideoName) || 'intro_drop';
  const [selectedVideo, setSelectedVideo] = useState<ActorVideoName>(
    videoParam in ACTOR_VIDEOS ? videoParam : 'intro_drop'
  );

  const meta = ACTOR_VIDEOS[selectedVideo];

  const [keyColor, setKeyColor] = useState<string>(meta.keyColor);
  const [similarity, setSimilarity] = useState<number>(meta.similarity);
  const [smoothness, setSmoothness] = useState<number>(meta.smoothness);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setKeyColor(meta.keyColor);
    setSimilarity(meta.similarity);
    setSmoothness(meta.smoothness);
  }, [meta]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white p-6 sm:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Safari WebGL Chroma-Key Shader Tuner
              </h1>
              <p className="text-xs text-gray-400">
                Calibrate CbCr similarity and smoothness against MP4 keyed footage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(['intro_drop', 'analytics_laptop', 'explain_close'] as ActorVideoName[]).map(
              (name) => (
                <button
                  key={name}
                  onClick={() => setSelectedVideo(name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedVideo === name
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {name}
                </button>
              )
            )}
          </div>
        </div>

        {/* Viewport Canvas with Checkerboard Background */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gray-700 mb-8 shadow-2xl">
          {/* Transparent Checkerboard Pattern */}
          <div
            className="absolute inset-0 z-0 opacity-40"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #374151 25%, transparent 25%),
                linear-gradient(-45deg, #374151 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #374151 75%),
                linear-gradient(-45deg, transparent 75%, #374151 75%)
              `,
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px',
              backgroundColor: '#1f2937',
            }}
          />

          {/* Hidden Source Video */}
          <video
            ref={videoRef}
            src={meta.fallbackMp4}
            muted
            playsInline
            loop
            autoPlay
            className="hidden"
          />

          {/* WebGL Chroma-Key Canvas */}
          <div className="relative z-10 w-full h-full">
            <ChromaKeyCanvas
              videoElement={videoRef.current}
              keyColorHex={keyColor}
              similarity={similarity}
              smoothness={smoothness}
              width={meta.w}
              height={meta.h}
            />
          </div>

          {/* Play/Pause control overlay */}
          <button
            onClick={togglePlay}
            className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur text-xs flex items-center gap-1.5 font-medium transition"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl bg-gray-900 border border-gray-800">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Key Color (Hex)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={keyColor}
                onChange={(e) => setKeyColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
              />
              <input
                type="text"
                value={keyColor}
                onChange={(e) => setKeyColor(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-sm font-mono text-white border border-gray-700"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              <span>Similarity</span>
              <span className="font-mono text-blue-400">{similarity.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.80"
              step="0.01"
              value={similarity}
              onChange={(e) => setSimilarity(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              <span>Smoothness / Blend</span>
              <span className="font-mono text-blue-400">{smoothness.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.40"
              step="0.01"
              value={smoothness}
              onChange={(e) => setSmoothness(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DebugKeyPage() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading shader tuner...</div>}>
      <KeyTunerContent />
    </Suspense>
  );
}
