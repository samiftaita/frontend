import React, { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";
import { chatbotApi } from "../services/api";

const ChatbotContext = createContext();

export const useChatbot = () => {
  return useContext(ChatbotContext);
};

export const ChatbotProvider = ({ children }) => {
  const [messages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const response = await chatbotApi.sendMessage(message);
      return response.data.reponse;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatbotContext.Provider
      value={{ messages, sendMessage, isOpen, setIsOpen, loading }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

ChatbotProvider.propTypes = {
  children: PropTypes.node,
};

ChatbotProvider.defaultProps = {
  children: null,
};
