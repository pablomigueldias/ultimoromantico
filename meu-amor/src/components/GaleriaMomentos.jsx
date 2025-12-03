import "./GaleriaMomentos.css";
import { useState } from "react";
import Lightbox from "./Lightbox";

import foto1 from "../img/img1.jpg";
import foto2 from "../img/img2.jpg";
import foto3 from "../img/img3.jpg";
import foto4 from "../img/img4.jpg";
import foto5 from "../img/img5.jpg";
import foto6 from "../img/img6.jpg";

const momentos = [
    { imagem: foto1, legenda: "Aquele começo inesperado… ❤️" },
    { imagem: foto2, legenda: "Sua risada? Meu som favorito 😂💕" },
    { imagem: foto3, legenda: "Esse dia vive na minha mente ✨" },
    { imagem: foto4, legenda: "Só a gente entende 💫" },
    { imagem: foto5, legenda: "Seu abraço = meu lugar favorito 🤍" },
    { imagem: foto6, legenda: "Eu escolheria você de novo 💖" },
];

function GaleriaMomentos() {
    const [showLightbox, setShowLightbox] = useState(false);
    const [fotoIndex, setFotoIndex] = useState(0);
    const [likedStatus, setLikedStatus] = useState(
        Array(momentos.length).fill(false)
    );

    return (
        <section className="galeria">
            <h2>Nossos momentos 📸</h2>

            <div className="galeria-grid">
                {momentos.map((momento, index) => (
                    <div
                        key={index}
                        className={`galeria-imagem-wrapper ${likedStatus[index] ? "liked-photo" : ""
                            }`}
                        onClick={() => {
                            setFotoIndex(index);
                            setShowLightbox(true);
                        }}
                    >
                        <img src={momento.imagem} alt="foto" />

                        {likedStatus[index] && (
                            <span className="like-icon-feed">❤️</span>
                        )}
                    </div>
                ))}
            </div>

            {showLightbox && (
                <Lightbox
                    fotos={momentos}
                    indexInicial={fotoIndex}
                    onClose={() => setShowLightbox(false)}
                    setLikedStatus={setLikedStatus}
                />
            )}
        </section>
    );
}

export default GaleriaMomentos;
