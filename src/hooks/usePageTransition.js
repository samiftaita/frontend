import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hook pour gérer les transitions de page.
 * Retourne `visible` qui passe à true après le montage initial.
 */
const usePageTransition = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(t);
  }, [location.pathname]);

  return visible;
};

export default usePageTransition;
