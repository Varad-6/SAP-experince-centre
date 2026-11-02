import { useEffect } from 'react';
import { useStore } from './store';

export function useGlobalInput() {
  const {
    scene,
    cardIndex,
    nextCard,
    prevCard,
    exitDemo,
    goLanding,
    goPillars,
    startDemo,
    muted,
    setMuted,
    captions,
    setCaptions,
    autoplay,
    setAutoplay,
  } = useStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't intercept if user is typing in an input or textarea
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          if (scene === 'LANDING') {
            goPillars();
          } else if (scene === 'DEMO_INTRO' || scene === 'PROJECT') {
            startDemo();
          } else if (scene === 'DEMO') {
            nextCard();
          }
          break;

        case 'Escape':
        case 'Backspace':
          e.preventDefault();
          if (scene === 'DEMO' || scene === 'DEMO_INTRO' || scene === 'DEMO_END') {
            exitDemo();
          } else if (scene === 'PROJECT' || scene === 'PILLAR') {
            goPillars();
          } else if (scene === 'PILLARS') {
            goLanding();
          }
          break;

        case 'ArrowRight':
          if (scene === 'DEMO') {
            e.preventDefault();
            nextCard();
          }
          break;

        case 'ArrowLeft':
          if (scene === 'DEMO') {
            e.preventDefault();
            prevCard();
          }
          break;

        case 'm':
        case 'M':
          setMuted(!muted);
          break;

        case 'c':
        case 'C':
          setCaptions(!captions);
          break;

        case 'a':
        case 'A':
          setAutoplay(!autoplay);
          break;

        case 'f':
        case 'F':
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
          break;
      }
    }

    // Touch swipe handling
    let touchStartX = 0;
    let touchStartY = 0;

    function handleTouchStart(e: TouchEvent) {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }

    function handleTouchEnd(e: TouchEvent) {
      if (scene !== 'DEMO') return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;

      // Check for horizontal swipe with minimum threshold
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) {
          nextCard();
        } else {
          prevCard();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    scene,
    cardIndex,
    muted,
    captions,
    autoplay,
    nextCard,
    prevCard,
    exitDemo,
    goLanding,
    goPillars,
    startDemo,
    setMuted,
    setCaptions,
    setAutoplay,
  ]);
}
