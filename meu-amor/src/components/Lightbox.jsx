import { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import "./Lightbox.css";

const DURACAO = 6000; // duração de cada "story" em ms

function Lightbox({ fotos, indexInicial, onClose, setLikedStatus }) {
    const [index, setIndex] = useState(indexInicial);
    const [textoDigitado, setTextoDigitado] = useState("");
    const [elapsed, setElapsed] = useState(0);
    const [liked, setLiked] = useState(() => fotos.map(() => false));

    const audioRef = useRef(new Audio("/music/story.mp3"));
    const floatingHeartRef = useRef(null);
    const touchStartRef = useRef(0);
    const startTimeRef = useRef(Date.now()); // controla início do story atual
    const heartRainRef = useRef(null); // container da chuva de corações
    const lastTapRef = useRef(0); // controla double tap no mobile

    audioRef.current.volume = 0.5;
    const fotoAtual = fotos[index];

    // ===========================
    // Música automática
    // ===========================
    useEffect(() => {
        audioRef.current.play().catch(() => { });
        return () => audioRef.current.pause();
    }, []);

    // ===========================
    // Reseta o "startTime" sempre que troca de foto
    // ===========================
    useEffect(() => {
        startTimeRef.current = Date.now();
        setElapsed(0);
    }, [index]);

    // ===========================
    // Texto digitando
    // ===========================
    useEffect(() => {
        setTextoDigitado("");

        let i = 0;
        const interval = setInterval(() => {
            setTextoDigitado(fotoAtual.legenda.substring(0, i));
            i++;
            if (i > fotoAtual.legenda.length) clearInterval(interval);
        }, 35);

        return () => clearInterval(interval);
    }, [index, fotoAtual.legenda]);

    // ===========================
    // Autoplay usando só 1 intervalo global
    // ===========================
    useEffect(() => {
        const step = 80;

        const interval = setInterval(() => {
            const diff = Date.now() - startTimeRef.current;
            const nextElapsed = Math.min(diff, DURACAO);

            setElapsed(nextElapsed);

            if (diff >= DURACAO) {
                // avança 1 story e reinicia o relógio
                setIndex((prev) => (prev + 1) % fotos.length);
                startTimeRef.current = Date.now();
                setElapsed(0);
            }
        }, step);

        return () => clearInterval(interval);
    }, [fotos.length]);

    const progresso = Math.min(100, (elapsed / DURACAO) * 100);

    // ===========================
    // Navegação manual
    // ===========================
    const proxima = () => {
        setIndex((prev) => (prev + 1) % fotos.length);
    };

    const anterior = () => {
        setIndex((prev) => (prev - 1 + fotos.length) % fotos.length);
    };

    // ===========================
    // Chuva de corações
    // ===========================
    const fazerChuvaDeCoracoes = () => {
        const container = heartRainRef.current;
        if (!container) return;

        for (let i = 0; i < 12; i++) {
            const heart = document.createElement("span");
            heart.className = "flying-heart";
            heart.textContent = "❤️";

            // posição horizontal base (dentro do container)
            heart.style.left = Math.random() * 80 + "%";

            // tamanho aleatório
            const size = Math.random() * 22 + 16; // 16px a 38px
            heart.style.fontSize = `${size}px`;

            // valores aleatórios para a animação (ligados às CSS vars)
            const duracao = (Math.random() * 0.6 + 1.3).toFixed(2) + "s"; // 1.3s a 1.9s
            const rotacao = Math.floor(Math.random() * 90 - 45) + "deg";  // -45° a 45°
            const offset = Math.floor(Math.random() * 40 - 20) + "px";    // -20px a 20px

            heart.style.setProperty("--duracao", duracao);
            heart.style.setProperty("--rotacao", rotacao);
            heart.style.setProperty("--offset", offset);

            container.appendChild(heart);

            // remove depois da animação
            setTimeout(() => {
                heart.remove();
            }, 2000);
        }
    };

    // ===========================
    // Like sincronizado com feed
    // ===========================
    const toggleLike = () => {
        setLiked((prev) => {
            const copia = [...prev];
            const novoValor = !copia[index];
            copia[index] = novoValor;
            setLikedStatus(copia);

            if (novoValor) {
                // animação coração grande + chuva de corações
                fazerChuvaDeCoracoes();

                if (floatingHeartRef.current) {
                    floatingHeartRef.current.classList.add("show-heart");
                    setTimeout(() => {
                        if (floatingHeartRef.current) {
                            floatingHeartRef.current.classList.remove("show-heart");
                        }
                    }, 1200);
                }
            }

            return copia;
        });
    };

    // ===========================
    // Swipe + double tap (mobile)
    // ===========================
    const onTouchStart = (e) => {
        touchStartRef.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e) => {
        const fimX = e.changedTouches[0].clientX;
        const delta = fimX - touchStartRef.current;
        const now = Date.now();

        // swipe → navegação
        if (delta > 60) {
            anterior();
            return;
        }
        if (delta < -60) {
            proxima();
            return;
        }

        // toque curto (sem arrastar muito) → pode ser tap ou double tap
        if (Math.abs(delta) < 15) {
            if (now - lastTapRef.current < 280) {
                // double tap -> like
                toggleLike();
                lastTapRef.current = 0;
            } else {
                // single tap -> só registra o tempo
                lastTapRef.current = now;
            }
        }
    };

    // ===========================
    // ESC e setas do teclado
    // ===========================
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") proxima();
            if (e.key === "ArrowLeft") anterior();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    // ===========================
    // Render
    // ===========================
    return ReactDOM.createPortal(
        <div className="lightbox-overlay" onClick={onClose}>
            <div
                className="lightbox-content transition"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                {/* Contador (1 / X) */}
                <div className="contador-fotos">
                    {index + 1} / {fotos.length}
                </div>

                {/* Barrinhas estilo Stories */}
                <div className="story-indicators">
                    {fotos.map((_, i) => {
                        let width;

                        if (i < index) {
                            // já viu -> cheia
                            width = "100%";
                        } else if (i === index) {
                            // atual -> enche com o tempo
                            width = `${progresso}%`;
                        } else {
                            // ainda não viu -> vazia
                            width = "0%";
                        }

                        return (
                            <div className="story-indicator" key={i}>
                                <div
                                    className="story-indicator-fill"
                                    style={{ width }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Imagem (desktop: double click = like) */}
                <img
                    src={fotoAtual.imagem}
                    alt=""
                    className="lightbox-imagem"
                    onDoubleClick={toggleLike}
                />

                {/* Container da chuva de corações */}
                <div ref={heartRainRef} className="heart-rain-container" />

                {/* Coração flutuando central */}
                <span ref={floatingHeartRef} className="heart-floating">
                    ❤️
                </span>

                {/* Texto digitando */}
                <p className="lightbox-texto">
                    {textoDigitado}
                    <span className="cursor">|</span>
                </p>

                {/* Botões laterais */}
                <button className="nav-btn left" onClick={anterior}>
                    ‹
                </button>
                <button className="nav-btn right" onClick={proxima}>
                    ›
                </button>

                {/* Like */}
                <button
                    className={`like-btn ${liked[index] ? "liked" : ""}`}
                    onClick={toggleLike}
                >
                    ❤️
                </button>

                {/* Fechar */}
                <button className="lightbox-fechar" onClick={onClose}>
                    ✕
                </button>
            </div>
        </div>,
        document.body
    );
}

export default Lightbox;
