import { useEffect, useRef, useState } from "react";

/**
 * Hook pour déclencher une animation quand un élément entre dans le viewport.
 * @param {number} threshold - Pourcentage de visibilité requis (0-1)
 * @param {boolean} once - Si true, l'animation ne se déclenche qu'une fois
 */
const useScrollReveal = (threshold = 0.12, once = true) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, inView];
};

export default useScrollReveal;
