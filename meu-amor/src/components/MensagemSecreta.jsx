// src/components/MensagemSecreta.jsx
import { useState } from "react";
import "./MensagemSecreta.css";

const SECRET_QUESTION = "Como eu te chamo quando você fica brava até nos momentos de viadagi?";

// 👉 Altere essas respostas para combinar com VOCÊ e com ela
const SECRET_ANSWERS = ["brabinha", "Brabinha"];

export default function MensagemSecreta({ onVideoStart, onVideoEnd }) {
  const [answer, setAnswer] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [tries, setTries] = useState(0);
  const [confettiPieces] = useState(() =>
    Array.from({ length: 60 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }))
  );

  function handleUnlock(e) {
    e.preventDefault();

    const normalized = answer.trim().toLowerCase();

    const isCorrect = SECRET_ANSWERS.some(
      (ans) => normalized === ans.toLowerCase()
    );

    if (isCorrect) {
      setUnlocked(true);
      setError("");
      setTries(0);
      setAnswer(""); // limpa o campo depois que acertar
    } else {
      const newTries = tries + 1;
      setTries(newTries);

      if (newTries === 1) {
        setError(
          "Hmm... não é bem isso 😏 tenta lembrar como você fala comigo."
        );
      } else if (newTries === 2) {
        setError(
          "Oia... ta facil."
        );
      } else {
        setError(
          "Depois dessa tentativa você me deve 2 real no pix"
        );
      }
    }
  }

  return (
    <div className="mensagem-secreta-container">
      <div className={`mensagem-secreta-card ${unlocked ? "unlocked" : ""}`}>
        {!unlocked ? (
          <>
            <h2 className="ms-title">Mensagem secreta 🎁</h2>
            <p className="ms-subtitle">
              Para desbloquear essa mensagem especial, responde:
            </p>
            <p className="ms-question">"{SECRET_QUESTION}"</p>

            <form onSubmit={handleUnlock} className="ms-form">
              <input
                type="text"
                placeholder="Escreve aqui a resposta..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className={`ms-input ${error ? "ms-input-error" : ""}`}
              />
              <button type="submit" className="ms-button">
                Desbloquear 💘
              </button>
            </form>

            {error && <p className="ms-error">{error}</p>}

            <p className="ms-tip">
              Dica: Voce é minha _____ , Boa Noite minha _____
            </p>
          </>
        ) : (
          <div className="birthday-celebration">
            {/* Camada de confete (fica por cima de tudo) */}
            <div className="birthday-confetti-layer">
              {confettiPieces.map((piece, index) => (
                <span
                  key={index}
                  className="confetti-piece"
                  style={{
                    left: `${piece.left}%`,
                    animationDelay: `${piece.delay}s`,
                    animationDuration: `${piece.duration}s`,
                  }}
                />
              ))}
            </div>

            {/* Balões subindo no fundo */}
            <div className="birthday-balloons">
              <div className="balloon balloon-1"></div>
              <div className="balloon balloon-2"></div>
              <div className="balloon balloon-3"></div>
            </div>

            {/* Mensagem de aniversário divertida */}
            <div className="birthday-message">
              <h2 className="birthday-title">
                🎂 Parabéns, dona do meu coração 🎂
              </h2>
              <p className="birthday-text">
                Hoje é oficialmente o dia mundial de aturar as suas brabezas
                com prioridade máxima, aceitar seus surtos com carinho e ainda
                te chamar de linda no final. Parabéns, você desbloqueou o modo
                aniversário: tudo o que você pedir, eu penso com carinho… e
                talvez eu aceite. 😏
              </p>
              <p className="birthday-text small">
                Agora aproveita esse vídeo, porque depois vou cobrar beijo,
                abraço, dengo e, no mínimo, um pedaço de bolo bem caprichado.
                💘
              </p>
            </div>

            {/* Vídeo do aniversário com fundo "party" por baixo */}
            <div className="birthday-video-wrapper">
              <div className="birthday-video-party-bg">
                <span className="party-emoji">🎂</span>
                <span className="party-emoji">🎉</span>
                <span className="party-emoji">🎂</span>
                <span className="party-emoji">💖</span>
              </div>

              <video
                className="birthday-video"
                src="/videos/parabens-amor.mp4"
                controls
                autoPlay
                onPlay={onVideoStart}
                onEnded={onVideoEnd}
              />
            </div>

            {/* Corações pulsando na base */}
            <div className="birthday-hearts">
              <span>💖</span>
              <span>💗</span>
              <span>💞</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
