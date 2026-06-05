import React from "react";
import PropTypes from "prop-types";

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <p className="text-red-600 mb-2">
        {message || "Une erreur est survenue"}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Réessayer
        </button>
      )}
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
};

ErrorMessage.defaultProps = {
  message: "",
  onRetry: null,
};

export default ErrorMessage;
