import { useEffect, useState } from "react";

/**
 * Hook pour détecter le scroll et appliquer un effet sur la navbar.
 * Retourne `scrolled` (boolean) — true si la page a scrollé de plus de `threshold` px.
 */
const useNavbarScroll = (threshold = 20) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
};

export default useNavbarScroll;
