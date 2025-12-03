import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import "./CartasParaVoce.css";

const cartasIniciais = [
    {
        id: 1,
        titulo: "Carta 01 — Só para você 💌",
        texto:
            "Desde o dia em que você entrou na minha vida, tudo ficou mais leve, mais bonito e mais verdadeiro. Você é o meu lugar favorito no mundo.",
    },
    {
        id: 2,
        titulo: "Carta 02 — Sobre nós ✨",
        texto:
            "Eu amo como a gente ri de coisas bobas, como o tempo passa rápido quando estamos juntos, e como até o silêncio com você é confortável.",
    },
    {
        id: 3,
        titulo: "Carta 03 — Obrigado por existir 🌹",
        texto:
            "Obrigado por cada detalhe, cada mensagem, cada abraço apertado e cada olhar que diz mais do que mil palavras. Você é o meu melhor presente.",
    },
    {
        id: 4,
        titulo: "Carta 04 — Promessa ❤️",
        texto:
            "Prometo te amar nos dias fáceis e principalmente nos dias difíceis. Caminhar do seu lado, segurar sua mão e ser sempre seu porto seguro.",
    },
];

export default function CartasParaVoce() {
    const [cartaAtivaIndex, setCartaAtivaIndex] = useState(null); // null = nenhuma aberta
    const [textoDigitado, setTextoDigitado] = useState("");
    const [digitando, setDigitando] = useState(false);
    const [slideDirection, setSlideDirection] = useState("right");

    const typingIntervalRef = useRef(null);
    const flipSoundRef = useRef(null);
    const typeSoundRef = useRef(null);
    const touchStartXRef = useRef(0);

    const cartaAtiva =
        typeof cartaAtivaIndex === "number"
            ? cartasIniciais[cartaAtivaIndex]
            : null;

    function tocarSomFolha() {
        if (!flipSoundRef.current) return;
        try {
            flipSoundRef.current.currentTime = 0;
            flipSoundRef.current.play();
        } catch (err) {
            console.warn("Não foi possível tocar o som de página:", err);
        }
    }

    function pararSomDigitacao() {
        if (!typeSoundRef.current) return;
        typeSoundRef.current.pause();
        typeSoundRef.current.currentTime = 0;
        typeSoundRef.current.loop = false;
    }

    function iniciarDigitacao(textoCompleto) {
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
        }
        pararSomDigitacao();

        setTextoDigitado("");
        setDigitando(true);

        if (typeSoundRef.current) {
            try {
                typeSoundRef.current.volume = 0.4;
                typeSoundRef.current.currentTime = 0;
                typeSoundRef.current.loop = true;
                typeSoundRef.current.play().catch(() => { });
            } catch (err) {
                console.warn("Erro ao tocar máquina de escrever:", err);
            }
        }

        let i = 0;
        typingIntervalRef.current = setInterval(() => {
            i++;
            setTextoDigitado(textoCompleto.slice(0, i));

            if (i >= textoCompleto.length) {
                clearInterval(typingIntervalRef.current);
                typingIntervalRef.current = null;
                setDigitando(false);
                pararSomDigitacao();
            }
        }, 30);
    }

    function abrirCarta(index) {
        const carta = cartasIniciais[index];

        setTimeout(() => {
            setSlideDirection("right");
            setCartaAtivaIndex(index);
            tocarSomFolha();
            iniciarDigitacao(carta.texto);
        }, 180);
    }

    function fecharCarta() {
        setCartaAtivaIndex(null);
        setTextoDigitado("");
        setDigitando(false);

        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
        }
        pararSomDigitacao();
    }

    function proximaCarta() {
        if (typeof cartaAtivaIndex !== "number") return;

        const proximoIndex =
            cartaAtivaIndex + 1 < cartasIniciais.length ? cartaAtivaIndex + 1 : 0;
        const carta = cartasIniciais[proximoIndex];

        setSlideDirection("right");
        setCartaAtivaIndex(proximoIndex);
        tocarSomFolha();
        iniciarDigitacao(carta.texto);
    }

    function cartaAnterior() {
        if (typeof cartaAtivaIndex !== "number") return;

        const anteriorIndex =
            cartaAtivaIndex - 1 >= 0
                ? cartaAtivaIndex - 1
                : cartasIniciais.length - 1;
        const carta = cartasIniciais[anteriorIndex];

        setSlideDirection("left");
        setCartaAtivaIndex(anteriorIndex);
        tocarSomFolha();
        iniciarDigitacao(carta.texto);
    }

    // teclado: ESC, setas
    useEffect(() => {
        function handleKeyDown(e) {
            if (cartaAtivaIndex === null) return;

            if (e.key === "Escape") fecharCarta();
            if (e.key === "ArrowRight") proximaCarta();
            if (e.key === "ArrowLeft") cartaAnterior();
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [cartaAtivaIndex]);

    // cleanup
    useEffect(() => {
        return () => {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }
            pararSomDigitacao();
        };
    }, []);

    // swipe mobile
    function handleTouchStart(e) {
        touchStartXRef.current = e.touches[0].clientX;
    }

    function handleTouchEnd(e) {
        const endX = e.changedTouches[0].clientX;
        const delta = endX - touchStartXRef.current;

        if (delta < -40) {
            proximaCarta();
        } else if (delta > 40) {
            cartaAnterior();
        }
    }

    return (
        <section className="cartas-section">
            {/* sons */}
            <audio ref={flipSoundRef} src="/sounds/page-flip.mp3" preload="auto" />
            <audio ref={typeSoundRef} src="/sounds/typewriter.mp3" preload="auto" />

            <div className="cartas-header">
                <h2>Cartas para você ✉️</h2>
                <p>
                    Cada carta aqui é como se eu tivesse sentado, pegado uma folha de
                    papel e escrito tudo o que eu sinto por você, com calma, linha por
                    linha.
                </p>
            </div>

            {/* lista de cartinhas */}
            <div className="cartas-envelopes-lista">
                {cartasIniciais.map((carta, index) => (
                    <button
                        key={carta.id}
                        className="carta-envelopinho"
                        onClick={() => abrirCarta(index)}
                    >
                        <div className="carta-envelopinho-icone">
                            <div className="envelope-romantico">
                                <span className="envelope-coracao">💌</span>
                            </div>

                            <span className="carta-numero-badge">{index + 1}</span>
                        </div>

                        <div className="carta-envelopinho-topo">
                            <span className="carta-envelopinho-titulo">{carta.titulo}</span>
                        </div>

                        <span className="carta-envelopinho-legenda">
                            Toque para abrir essa lembrança
                        </span>
                    </button>
                ))}
            </div>

            {/* overlay fullscreen com folha */}
            {cartaAtiva &&
                ReactDOM.createPortal(
                    <div className="carta-overlay" onClick={fecharCarta}>
                        <div
                            className="folha-wrapper"
                            onClick={(e) => e.stopPropagation()}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            <div
                                className={`folha-carta slide-enter-${slideDirection}`}
                            >
                                <div className="folha-cabecalho">
                                    <span className="folha-etiqueta">Carta para você</span>
                                    <span className="folha-contador">
                                        {cartaAtivaIndex + 1} / {cartasIniciais.length}
                                    </span>
                                </div>

                                <h3 className="folha-titulo">{cartaAtiva.titulo}</h3>

                                <p
                                    className={`folha-texto ${digitando ? "digitando" : "digitacao-concluida"
                                        }`}
                                >
                                    {textoDigitado}
                                    <span className="carta-cursor" />
                                </p>

                                <div
                                    className={`folha-assinatura ${digitando ? "assinatura-escondida" : "assinatura-mostrada"
                                        }`}
                                >
                                    <span className="assinatura-frase">
                                        Com todo o meu amor,
                                    </span>

                                    <div className="assinatura-linha">
                                        <span className="assinatura-desenhada">
                                            seu amorzinho
                                        </span>
                                        <span className="assinatura-coracao">❤️</span>
                                    </div>
                                </div>
                            </div>

                            <div className="carta-overlay-controles">
                                <button
                                    className="carta-btn carta-btn-secundario"
                                    onClick={fecharCarta}
                                >
                                    Fechar
                                </button>
                                <button
                                    className="carta-btn carta-btn-primario"
                                    onClick={proximaCarta}
                                >
                                    Próxima carta ➜
                                </button>
                            </div>

                            <p className="carta-overlay-dica">
                                Dica: arraste para o lado no celular, use{" "}
                                <strong>ESC</strong> para fechar, <strong>←</strong> e{" "}
                                <strong>→</strong> para mudar de carta.
                            </p>
                        </div>
                    </div>,
                    document.body
                )}
        </section>
    );
}
