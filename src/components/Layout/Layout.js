import React from "react";
import PropTypes from "prop-types";
import Navbar from "./Navbar";
import Chatbot from "../Chatbot/Chatbot";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">{children}</div>
        </div>
      </main>
      <Chatbot />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

Layout.defaultProps = {
  children: null,
};

export default Layout;
