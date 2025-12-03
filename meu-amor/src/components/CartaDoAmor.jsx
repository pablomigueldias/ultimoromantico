// src/components/CartaDoAmor.jsx
import { useEffect, useState } from "react";
import "./CartaDoAmor.css";

const TEXTO_COMPLETO = `
Eu poderia te dizer mil vezes que te amo, mas nada explica exatamente o que eu sinto quando olho pra você.

Você é a minha pausa favorita do dia, o sorriso que aparece na minha cabeça sem pedir licença, o motivo de eu querer ser alguém melhor — não por obrigação, mas porque você merece a melhor versão de mim.

Eu amo quando você ri de verdade, quando faz drama sem necessidade, quando fica nervosa e mesmo assim continua linda. Amo suas manias, suas teimosias, seus áudios enormes e até os seus silêncios, porque até o seu silêncio conversa comigo.

Se um dia te der dúvida, lembra disso: eu escolho você. Nos dias fáceis, nos dias difíceis, nos dias em que a gente se entende, e nos dias em que a gente respira fundo e tenta de novo.

Obrigado por existir na minha vida do jeitinho que você é.

Com todo o meu amor,
`;

const ASSINATURA = "Seu chato favorito 💘";

export default function CartaDoAmor() {
  const [textoVisivel, setTextoVisivel] = useState("");
  const [index, setIndex] = useState(0);
  const [digitando, setDigitando] = useState(true);

  // animação de digitação
  useEffect(() => {
    if (!digitando) return;
    if (index >= TEXTO_COMPLETO.length) return;

    const timeout = setTimeout(() => {
      setTextoVisivel((prev) => prev + TEXTO_COMPLETO[index]);
      setIndex((prev) => prev + 1);
    }, 40); // velocidade da "escrita" (ms)

    return () => clearTimeout(timeout);
  }, [index, digitando]);

  function handleRecomecar() {
    setTextoVisivel("");
    setIndex(0);
    setDigitando(true);
  }

  function handleMostrarTudo() {
    setTextoVisivel(TEXTO_COMPLETO);
    setIndex(TEXTO_COMPLETO.length);
    setDigitando(false);
  }

  return (
    <div className="carta-amor-container">
      <div className="carta-amor-card">
        <div className="carta-header">
          <span className="carta-selo">💌 Carta para você</span>
          <span className="carta-subtitulo">
            Como se eu estivesse escrevendo isso bem agora.
          </span>
        </div>

        <div className="carta-corpo">
          <p className="carta-texto">{textoVisivel}</p>

          {/* assinatura aparece quando a carta termina ou quando mostrar tudo */}
          {index >= TEXTO_COMPLETO.length && (
            <p className="carta-assinatura">{ASSINATURA}</p>
          )}

          {/* indicador de digitação */}
          {index < TEXTO_COMPLETO.length && (
            <span className="carta-cursor">|</span>
          )}
        </div>

        <div className="carta-footer">
          <button
            type="button"
            className="carta-botao"
            onClick={handleRecomecar}
          >
            Recomeçar carta ✍️
          </button>

          {index < TEXTO_COMPLETO.length && (
            <button
              type="button"
              className="carta-botao carta-botao-secundario"
              onClick={handleMostrarTudo}
            >
              Mostrar tudo agora 💖
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
