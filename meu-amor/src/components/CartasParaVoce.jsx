import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import "./CartasParaVoce.css";

const cartasIniciais = [
    {
        id: 1,
        titulo: "Tudo mais leve 💌",
        texto:
            "Desde o dia em que você entrou na minha vida, tudo ficou mais leve, mais bonito e mais verdadeiro. Você é o meu lugar favorito no mundo. Você é a minha paz, a minha alegria e o meu cantinho seguro no meio do caos do mundo. Com você, tudo faz sentido.",
    },
    {
        id: 2,
        titulo: "O tempo voa ✨",
        texto:
            "Eu amo como, quando estou com você, o tempo voa. A gente pisca e já virou noite, já virou manhã, já virou história. E a verdade é que eu queria que cada momento durasse só um pouquinho mais… porque com você eu nunca quero que acabe. ",
    },
    {
        id: 3,
        titulo: "Obrigado por existir 🌹",
        texto:
            "Obrigado por cada gesto, por cada cuidado, por cada riso e por cada silêncio compartilhado. Obrigado por existir do jeitinho que você é. Você transformou minha vida sem nem perceber, e hoje eu entendo que o maior presente que eu já ganhei… foi você",
    },
    {
        id: 4,
        titulo: "Promessa ❤️",
        texto:
            "Eu prometo estar com você quando tudo sorrir e quando tudo desmoronar. Prometo te amar nos dias quentes de alegria e nos dias frios de silêncio. Prometo ser seu porto seguro, seu descanso e sua coragem. Obrigado por me escolher todos os dias. te amar nos dias fáceis e principalmente nos dias difíceis. Caminhar do seu lado, segurar sua mão e ser sempre seu porto seguro.",
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
                    Te amo meu amor com todo meu coração. Essas são algumas cartinhas que escrevi
                    para você. Espero que goste! 💖
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
                            Toque pra abrir a cartinha.
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
                                        Com todo amor,
                                    </span>

                                    <div className="assinatura-linha">
                                        <span className="assinatura-desenhada">
                                            Seu Homi
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
                                Minha brabinha linda. 
                            </p>
                        </div>
                    </div>,
                    document.body
                )}
        </section>
    );
}
