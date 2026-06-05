import React from "react";

/**
 * Wrapper qui applique une animation stagger à ses enfants.
 * Chaque enfant reçoit un délai croissant.
 *
 * @param {React.ReactNode[]} children
 * @param {number} stagger - Délai entre chaque enfant en ms (défaut: 60)
 * @param {number} baseDelay - Délai de base avant le premier enfant en ms (défaut: 0)
 * @param {string} animation - Classe d'animation CSS (défaut: 'animate-fadeInUp')
 * @param {string} className - Classes CSS supplémentaires sur le wrapper
 * @param {object} style - Styles inline sur le wrapper
 */
const AnimatedList = ({
  children,
  stagger = 60,
  baseDelay = 0,
  animation = "animate-fadeInUp",
  className = "",
  style = {},
}) => {
  const items = React.Children.toArray(children);

  return (
    <div className={className} style={style}>
      {items.map((child, i) =>
        React.cloneElement(child, {
          key: child.key ?? i,
          className: [child.props.className, animation]
            .filter(Boolean)
            .join(" "),
          style: {
            ...child.props.style,
            animationDelay: `${baseDelay + i * stagger}ms`,
            animationFillMode: "both",
          },
        }),
      )}
    </div>
  );
};

export default AnimatedList;
