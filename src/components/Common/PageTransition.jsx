import React from "react";
import usePageTransition from "../../hooks/usePageTransition";

/**
 * Wrapper qui applique une animation d'entrée à chaque changement de page.
 * Utilisation : entourer le contenu d'une page avec <PageTransition>.
 */
const PageTransition = ({ children, className = "" }) => {
  const visible = usePageTransition();

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition:
          "opacity 400ms cubic-bezier(0.16,1,0.3,1), transform 400ms cubic-bezier(0.16,1,0.3,1)",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
