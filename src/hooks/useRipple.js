import { useCallback } from "react";

/**
 * Hook pour ajouter un effet ripple sur un bouton.
 * Usage :
 *   const createRipple = useRipple();
 *   <button onClick={createRipple} ...>
 */
const useRipple = () => {
  const createRipple = useCallback((event) => {
    const button = event.currentTarget;
    const existing = button.querySelector(".ripple");
    if (existing) existing.remove();

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");

    button.appendChild(circle);
    circle.addEventListener("animationend", () => circle.remove(), {
      once: true,
    });
  }, []);

  return createRipple;
};

export default useRipple;
