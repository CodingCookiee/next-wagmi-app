export const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const startPosition = window.pageYOffset;
      const offset = 100;
      const targetPosition =
        element.getBoundingClientRect().top + window.pageYOffset - offset;
      const distance = targetPosition - startPosition;
      const duration = 1000;
      let start = null;
  
      const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };
  
      const animation = (currentTime) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const easeProgress = easeInOutCubic(progress);
  
        window.scrollTo(0, startPosition + distance * easeProgress);
  
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };
  
      requestAnimationFrame(animation);
    }
  };