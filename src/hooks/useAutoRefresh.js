import { useEffect, useRef } from "react";

/**
 * Déclenche automatiquement un callback à intervalle régulier.
 * S'arrête proprement au démontage du composant.
 *
 * @param {Function} callback  - Fonction à appeler (ex: loadData)
 * @param {number}   interval  - Intervalle en ms (défaut: 30 000 = 30 s)
 * @param {boolean}  enabled   - Activer/désactiver le refresh (défaut: true)
 */
const useAutoRefresh = (callback, interval = 30000, enabled = true) => {
  const savedCallback = useRef(callback);

  // Toujours garder la référence à jour sans redémarrer le timer
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => savedCallback.current();
    const id = setInterval(tick, interval);

    return () => clearInterval(id);
  }, [interval, enabled]);
};

export default useAutoRefresh;
