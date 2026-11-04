import { useEffect } from 'react';
import { useStore } from './store';

export function useGlobalInput() {
  const {
    scene,
    nextCard,
    prevCard,
    exitDemo,
    goLanding,
    goPillars,
  } = useStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'Enter':
          if (scene === 'DEMO') {
            e.preventDefault();
            nextCard();
          }
          break;

        case 'Escape':
        case 'Backspace':
          e.preventDefault();
          if (scene === 'DEMO' || scene === 'DEMO_END') {
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
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scene, nextCard, prevCard, exitDemo, goLanding, goPillars]);
}
