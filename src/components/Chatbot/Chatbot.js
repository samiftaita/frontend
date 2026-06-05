import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { chatbotApi } from "../../services/api";

const BUBBLE_MESSAGES = [
  "Bonjour ! Je suis DentoraBot",
  "Besoin d’un rendez-vous ?",
  "Je réponds à vos questions !",
  "Votre sourire, ma priorité",
];

const INITIAL_MESSAGE = {
  type: "bot",
  text: "Bonjour ! Je suis DentoraBot, votre assistant virtuel. Je peux vous renseigner sur nos services, nos tarifs ou vous aider à prendre rendez-vous. Comment puis-je vous aider aujourd’hui ?",
};

const CHATBOT_LOGO_SRC = "/dentorabot.png";
const CHATBOT_LOGO_FALLBACK = "/logo192.png";

const handleLogoError = (event) => {
  if (event.currentTarget.src.includes(CHATBOT_LOGO_FALLBACK)) return;
  event.currentTarget.src = CHATBOT_LOGO_FALLBACK;
};

/* ─────────────────────────────
   FAB launcher — image mascotte
   → Dépose ton image dans : public/dentorabot.png
───────────────────────────── */
const ChatbotFAB = ({ isOpen, onClick }) => (
  <div className="dentora-fab relative inline-flex items-center justify-center">
    {/* ── Bouton principal ── */}
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "Fermer DentoraBot" : "Ouvrir DentoraBot"}
      aria-expanded={isOpen}
      className={`p-0 border-0 bg-transparent cursor-pointer
        transition-transform duration-200
        ${isOpen ? "scale-95" : "hover:scale-110 hover:-translate-y-1"}`}
      style={{
        animation: isOpen ? "none" : "dentoraFloat 2.8s ease-in-out infinite",
      }}
    >
      <img
        src={CHATBOT_LOGO_SRC}
        alt="DentoraBot"
        className="w-[4.5rem] h-[4.5rem] rounded-full object-cover object-top shadow-lg"
        onError={handleLogoError}
        loading="eager"
        decoding="async"
      />
    </button>

    {/* ── Point vert "en ligne" ── */}
    <span
      className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full
        bg-green-500 border-2 border-white pointer-events-none"
      style={{ animation: "dentoraPulse 1.6s ease-in-out infinite" }}
    />

    {/* ── Badge × quand ouvert ── */}
    {isOpen && (
      <button
        type="button"
        onClick={onClick}
        aria-label="Fermer le chatbot"
        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full
          bg-red-500 border-2 border-white
          flex items-center justify-center cursor-pointer p-0
          shadow-[0_4px_12px_rgba(239,68,68,0.40)]"
      >
        <svg
          width="8"
          height="8"
          fill="none"
          stroke="white"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    )}
  </div>
);

ChatbotFAB.propTypes = {
  isOpen: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

ChatbotFAB.defaultProps = {
  isOpen: false,
  onClick: () => {},
};

const Chatbot = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [bubbleIndex, setBubbleIndex] = useState(0);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const currentBasePath = useMemo(() => {
    if (location.pathname.startsWith("/patient")) return "/patient";
    if (location.pathname.startsWith("/dentiste")) return "/dentiste";
    if (location.pathname.startsWith("/admin")) return "/admin";
    return "";
  }, [location.pathname]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setBubbleVisible(false);
      return undefined;
    }

    setBubbleVisible(true);

    const interval = setInterval(() => {
      setBubbleVisible(false);

      const timeout = setTimeout(() => {
        setBubbleIndex((index) => (index + 1) % BUBBLE_MESSAGES.length);
        setBubbleVisible(true);
      }, 350);

      return () => clearTimeout(timeout);
    }, 4200);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleAction = (action) => {
    if (!action || action === "null") return;

    const routes = {
      redirect_to_appointment: currentBasePath
        ? `${currentBasePath}/rendez-vous`
        : "/rendez-vous",
      show_services: currentBasePath ? `${currentBasePath}/services` : "/",
    };

    if (routes[action]) navigate(routes[action]);
  };

  const getActionLabel = (action) => {
    if (action === "redirect_to_appointment") return "Voir les rendez-vous";
    if (action === "show_services") return "Voir les services";
    return null;
  };

  const sendMessage = async () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage || loading) return;

    setMessages((prev) => [...prev, { type: "user", text: trimmedMessage }]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await chatbotApi.sendMessage(trimmedMessage);
      const data = response?.data?.data;

      if (!data?.message) throw new Error("Format de réponse invalide");

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: data.message,
          action: data.action,
          intent: data.intent,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Désolé, je rencontre une petite difficulté technique. Pourriez-vous reformuler votre question ?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="dentora-chatbot" aria-live="polite">
      <style>{`
        .dentora-chatbot {
          --primary-950: #062033;
          --primary-900: #082f49;
          --primary-800: #075985;
          --primary-700: #0369a1;
          --brand-600: #0284c7;
          --brand-500: #0ea5e9;
          --brand-400: #38bdf8;
          --soft-bg: #f0f9ff;
          --soft-border: rgba(186, 230, 253, 0.75);
          position: fixed;
          right: 1.5rem;
          bottom: 1.5rem;
          z-index: 9999;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .dentora-launcher-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .dentora-fab {
          position: relative;
          z-index: 3;
        }

        .dentora-bubble {
          position: absolute;
          right: -0.25rem;
          bottom: calc(100% + 0.65rem);
          max-width: 200px;
          padding: 0.6rem 0.85rem;
          color: #0f172a;
          background: rgba(255,255,255,0.96);
          border: 1px solid rgba(226,232,240,0.95);
          border-radius: 1rem 1rem 0.25rem 1rem;
          box-shadow: 0 12px 36px rgba(15,23,42,0.14);
          backdrop-filter: blur(14px);
          white-space: nowrap;
          font-size: 0.78rem;
          font-weight: 700;
          line-height: 1.35;
          animation: dentoraBubblePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: bottom right;
          pointer-events: none;
          z-index: 2;
        }

        .dentora-bubble::after {
          content: '';
          position: absolute;
          right: 22px;
          bottom: -7px;
          width: 12px;
          height: 12px;
          background: rgba(255,255,255,0.96);
          border-right: 1px solid rgba(226,232,240,0.95);
          border-bottom: 1px solid rgba(226,232,240,0.95);
          transform: rotate(-45deg);
        }

        .dentora-launcher {
          display: block;
          padding: 0;
          background: transparent;
          border: 0;
          cursor: pointer;
          transition: transform 0.25s ease, filter 0.25s ease;
          transform-origin: bottom center;
        }

        .dentora-launcher:hover {
          transform: translateY(-4px) scale(1.02);
        }

        .dentora-launcher.is-floating {
          animation: dentoraFloat 2.8s ease-in-out infinite;
        }

        .dentora-launcher.is-open {
          filter: brightness(0.96) saturate(0.95);
        }

        .dentora-tooth {
          display: block;
          filter: drop-shadow(0 16px 28px rgba(2, 132, 199, 0.28)) drop-shadow(0 2px 6px rgba(15,23,42,0.12));
        }

        .dentora-close-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 24px;
          height: 24px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          color: white;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border: 2px solid white;
          box-shadow: 0 8px 18px rgba(239, 68, 68, 0.35);
          font-size: 0.72rem;
          font-weight: 900;
          cursor: pointer;
        }

        .dentora-window {
          position: absolute;
          right: 0;
          bottom: 120px;
          width: 410px;
          max-width: calc(100vw - 2rem);
          height: 620px;
          max-height: calc(100vh - 8rem);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(186, 230, 253, 0.78);
          border-radius: 2rem;
          box-shadow: 0 30px 90px rgba(8, 47, 73, 0.25);
          backdrop-filter: blur(18px);
          animation: dentoraSlideUp 0.28s ease both;
        }

        .dentora-header {
          position: relative;
          overflow: hidden;
          padding: 1.25rem;
          color: white;
          background:
            radial-gradient(circle at 85% 10%, rgba(56, 189, 248, 0.35), transparent 34%),
            linear-gradient(135deg, var(--primary-950), var(--primary-800));
        }

        .dentora-header::before {
          content: '';
          position: absolute;
          inset: auto -50px -80px auto;
          width: 170px;
          height: 170px;
          border-radius: 999px;
          background: rgba(14, 165, 233, 0.18);
          filter: blur(6px);
        }

        .dentora-header-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .dentora-profile {
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }

        .dentora-icon-box {
          width: 3.1rem;
          height: 3.1rem;
          display: grid;
          place-items: center;
          border-radius: 1.1rem;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.15);
        }

        .dentora-title {
          margin: 0;
          font-size: 1.08rem;
          line-height: 1.1;
          font-weight: 900;
          letter-spacing: -0.025em;
        }

        .dentora-status {
          margin-top: 0.35rem;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: #bae6fd;
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .dentora-status-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 0 4px rgba(34,197,94,0.16);
          animation: dentoraPulse 1.6s ease-in-out infinite;
        }

        .dentora-header-chip {
          padding: 0.45rem 0.65rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.16);
          font-size: 0.68rem;
          font-weight: 800;
          color: #e0f2fe;
        }

        .dentora-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
          background:
            radial-gradient(circle at top left, rgba(14,165,233,0.10), transparent 30%),
            linear-gradient(180deg, #f8fcff, #f0f9ff);
        }

        .dentora-messages::-webkit-scrollbar {
          width: 7px;
        }

        .dentora-messages::-webkit-scrollbar-thumb {
          background: rgba(14, 165, 233, 0.25);
          border-radius: 999px;
        }

        .dentora-row {
          display: flex;
          margin-bottom: 1rem;
          animation: dentoraFadeIn 0.28s ease both;
        }

        .dentora-row.is-user {
          justify-content: flex-end;
        }

        .dentora-row.is-bot {
          justify-content: flex-start;
        }

        .dentora-message {
          max-width: 84%;
          padding: 0.85rem 0.95rem;
          border-radius: 1.25rem;
          font-size: 0.88rem;
          line-height: 1.55;
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.07);
        }

        .dentora-message.is-user {
          color: white;
          background: linear-gradient(135deg, var(--brand-600), var(--primary-700));
          border-bottom-right-radius: 0.35rem;
        }

        .dentora-message.is-bot {
          color: #0f172a;
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(186, 230, 253, 0.75);
          border-bottom-left-radius: 0.35rem;
        }

        .dentora-action {
          margin-top: 0.6rem;
          padding: 0.45rem 0.7rem;
          border: 1px solid rgba(2, 132, 199, 0.28);
          border-radius: 0.75rem;
          background: rgba(14, 165, 233, 0.08);
          color: #075985;
          font-size: 0.76rem;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .dentora-action:hover {
          background: rgba(14, 165, 233, 0.16);
          transform: translateY(-1px);
        }

        .dentora-loader {
          display: inline-flex;
          align-items: center;
          gap: 0.28rem;
          padding: 0.95rem 1rem;
          background: white;
          border: 1px solid rgba(186, 230, 253, 0.8);
          border-radius: 1.25rem 1.25rem 1.25rem 0.35rem;
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
        }

        .dentora-loader span {
          width: 0.42rem;
          height: 0.42rem;
          border-radius: 999px;
          background: var(--brand-500);
          animation: dentoraTyping 1s infinite ease-in-out;
        }

        .dentora-loader span:nth-child(2) { animation-delay: 0.15s; }
        .dentora-loader span:nth-child(3) { animation-delay: 0.3s; }

        .dentora-input-zone {
          padding: 1rem 1.15rem 1.15rem;
          background: rgba(255,255,255,0.98);
          border-top: 1px solid rgba(186, 230, 253, 0.55);
        }

        .dentora-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .dentora-input {
          width: 100%;
          min-height: 3.35rem;
          padding: 0 3.45rem 0 1rem;
          color: #0f172a;
          background: #f0f9ff;
          border: 1px solid transparent;
          border-radius: 1rem;
          outline: none;
          font-size: 0.88rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .dentora-input:focus {
          background: white;
          border-color: rgba(14, 165, 233, 0.55);
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.12);
        }

        .dentora-send {
          position: absolute;
          right: 0.45rem;
          width: 2.45rem;
          height: 2.45rem;
          display: grid;
          place-items: center;
          color: white;
          background: linear-gradient(135deg, var(--brand-600), var(--primary-800));
          border: 0;
          border-radius: 0.8rem;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
          box-shadow: 0 10px 22px rgba(2,132,199,0.28);
        }

        .dentora-send:hover:not(:disabled) {
          transform: translateY(-1px) scale(1.02);
        }

        .dentora-send:disabled {
          cursor: not-allowed;
          opacity: 0.42;
          box-shadow: none;
        }

        .dentora-powered {
          margin: 0.75rem 0 0;
          color: #64748b;
          text-align: center;
          font-size: 0.62rem;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        @keyframes dentoraFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          35% { transform: translateY(-10px) rotate(2deg); }
          70% { transform: translateY(-4px) rotate(-1deg); }
        }

        @keyframes dentoraBubblePop {
          from { opacity: 0; transform: scale(0.72) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes dentoraSlideUp {
          from { opacity: 0; transform: translateY(18px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes dentoraFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes dentoraPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.86); opacity: 0.75; }
        }

        @keyframes dentoraTyping {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
          40% { transform: translateY(-4px); opacity: 1; }
        }

        @media (max-width: 640px) {
          .dentora-chatbot {
            right: 1rem;
            bottom: 1rem;
          }

          .dentora-window {
            position: fixed;
            right: 1rem;
            left: 1rem;
            bottom: 5rem;
            width: auto;
            height: min(620px, calc(100vh - 7rem));
            border-radius: 1.5rem;
          }

          .dentora-bubble {
            right: -0.2rem;
            bottom: calc(100% + 0.55rem);
            max-width: 160px;
            white-space: normal;
            font-size: 0.72rem;
          }
        }
      `}</style>

      <div className="dentora-launcher-wrap">
        {!isOpen && bubbleVisible && (
          <div className="dentora-bubble">{BUBBLE_MESSAGES[bubbleIndex]}</div>
        )}

        <ChatbotFAB
          isOpen={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        />
      </div>

      {isOpen && (
        <section
          className="dentora-window"
          role="dialog"
          aria-label="Assistant virtuel DentoraBot"
        >
          <header className="dentora-header">
            <div className="dentora-header-content">
              <div className="dentora-profile">
                <div className="dentora-icon-box">
                  <img
                    src={CHATBOT_LOGO_SRC}
                    alt="DentoraBot"
                    style={{
                      width: "2.9rem",
                      height: "2.9rem",
                      borderRadius: "0.75rem",
                      objectFit: "cover",
                      objectPosition: "top",
                    }}
                    onError={handleLogoError}
                    loading="eager"
                    decoding="async"
                  />
                </div>

                <div>
                  <h3 className="dentora-title">DentoraBot</h3>
                  <div className="dentora-status">
                    <span className="dentora-status-dot" />
                    En ligne
                  </div>
                </div>
              </div>

              <div className="dentora-header-chip">AI Assistant</div>
            </div>
          </header>

          <main className="dentora-messages">
            {messages.map((msg, index) => (
              <div
                key={`${msg.type}-${index}`}
                className={`dentora-row ${msg.type === "user" ? "is-user" : "is-bot"}`}
              >
                <div
                  className={`dentora-message ${msg.type === "user" ? "is-user" : "is-bot"}`}
                >
                  {msg.text}
                  {msg.type === "bot" &&
                    msg.action &&
                    msg.action !== "null" &&
                    getActionLabel(msg.action) && (
                      <button
                        type="button"
                        className="dentora-action"
                        onClick={() => handleAction(msg.action)}
                      >
                        {getActionLabel(msg.action)}
                      </button>
                    )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="dentora-row is-bot">
                <div
                  className="dentora-loader"
                  aria-label="DentoraBot écrit une réponse"
                >
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </main>

          <footer className="dentora-input-zone">
            <div className="dentora-input-wrap">
              <input
                type="text"
                placeholder="Posez votre question..."
                className="dentora-input"
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                aria-label="Message à envoyer"
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={loading || !inputMessage.trim()}
                className="dentora-send"
                aria-label="Envoyer le message"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9-16-18 8 8 3 1 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 14l10-11"
                  />
                </svg>
              </button>
            </div>

            <p className="dentora-powered">Alimenté par DENTORA AI</p>
          </footer>
        </section>
      )}
    </div>
  );
};

export default Chatbot;
