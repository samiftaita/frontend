import React, { useMemo, useRef, useState } from "react";
import { chatbotApi } from "../../services/api";

const quickMessages = [
  "Prendre un rendez-vous",
  "Voir les services",
  "Urgence dentaire",
  "Horaires du cabinet",
];

const PatientChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Bonjour, je suis votre assistant dentaire. Comment puis-je vous aider ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading],
  );

  const scrollBottom = () => {
    requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const sendMessage = async (text) => {
    const value = text.trim();
    if (!value || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: value }]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await chatbotApi.sendMessage(value);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: response.data.reponse || "Aucune reponse recue." },
      ]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Le chatbot ne repond pas pour le moment.",
      );
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Desole, une erreur est survenue." },
      ]);
    } finally {
      setLoading(false);
      scrollBottom();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await sendMessage(input);
    }
  };

  return (
    <div>
      <h2 className="patient-page-title">Chatbot patient</h2>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={
                message.role === "user"
                  ? "chat-message-user"
                  : "chat-message-bot"
              }
            >
              {message.text}
            </div>
          ))}
          {loading && (
            <div className="chat-message-bot">
              Le bot est en train d'ecrire...
            </div>
          )}
          <div ref={endRef}></div>
        </div>

        <div className="chat-quick-actions">
          {quickMessages.map((item) => (
            <button
              key={item}
              type="button"
              className="btn"
              onClick={() => sendMessage(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {error && (
          <div className="patient-error">
            <p>{error}</p>
          </div>
        )}

        <form className="chat-form" onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ecrivez votre message"
            rows="2"
          />
          <button type="submit" className="btn btn-primary" disabled={!canSend}>
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientChatbot;
