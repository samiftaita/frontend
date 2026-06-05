import React from "react";
import useScrollReveal from "../../hooks/useScrollReveal";

/**
 * Composant qui révèle son contenu quand il entre dans le viewport.
 *
 * @param {string} direction - 'up' | 'left' | 'right' | 'scale' (défaut: 'up')
 * @param {number} delay - Délai en ms avant le déclenchement (défaut: 0)
 * @param {number} threshold - Seuil de visibilité 0-1 (défaut: 0.12)
 * @param {string} className - Classes CSS supplémentaires
 * @param {object} style - Styles inline supplémentaires
 */
const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  threshold = 0.12,
  className = "",
  style = {},
  as: Tag = "div",
}) => {
  const [ref, inView] = useScrollReveal(threshold);

  const classMap = {
    up: "reveal",
    left: "reveal-left",
    right: "reveal-right",
    scale: "reveal-scale",
  };

  const revealClass = classMap[direction] || "reveal";

  return (
    <Tag
      ref={ref}
      className={`${revealClass} ${inView ? "in-view" : ""} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
};

export default ScrollReveal;
