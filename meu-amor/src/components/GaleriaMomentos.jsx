import "./GaleriaMomentos.css";
import { useState } from "react";
import Lightbox from "./Lightbox";

import foto1 from "../img/img1.jpg";
import foto2 from "../img/img2.jpg";
import foto3 from "../img/img3.jpg";
import foto4 from "../img/img4.jpg";
import foto5 from "../img/img5.jpg";
import foto6 from "../img/img6.jpg";
import foto7 from "../img/img7.jpg";
import foto8 from "../img/img8.jpg";
import foto9 from "../img/img9.jpg";
import foto10 from "../img/img10.jpg";
import foto11 from "../img/img11.jpg";
import foto12 from "../img/img12.jpg";
import foto13 from "../img/img13.jpg";
import foto14 from "../img/img14.jpg";
import foto15 from "../img/img15.jpg";
import foto16 from "../img/img16.jpg";
import foto17 from "../img/img17.jpg";
import foto18 from "../img/img18.jpg";
import foto19 from "../img/img19.jpg";
import foto20 from "../img/img20.jpg";
import foto21 from "../img/img21.jpg";
import foto22 from "../img/img22.jpg";
import foto23 from "../img/img23.jpg";
import foto24 from "../img/img24.jpg";
import foto25 from "../img/img25.jpg";
import foto26 from "../img/img26.jpg";
import foto27 from "../img/img27.jpg";
import foto28 from "../img/img28.jpg";


const momentos = [
    { imagem: foto1, legenda: "Mas como ama tirar foto minha dormindo 🤔" },
    { imagem: foto2, legenda: "Nao lembro quando tiramos essa foto(pra variar)😂" },
    { imagem: foto3, legenda: "Bocão mais gostoso desse mundo todin" },
    { imagem: foto4, legenda: "Eu todo esquisito e muie toda poderosa e lindona" },
    { imagem: foto5, legenda: "Toda Cuidadosa cuidando do maior sofrimento do homem. A Gripe." },
    { imagem: foto6, legenda: "Serio a boca mais gostosa do mundo." },
    { imagem: foto7, legenda: "Todo arrumado par ver seus 'homi'😒 " },
    { imagem: foto8, legenda: "Novamente nao lembro o dia dessa foto.estava com uma cara de ursinho " },
    { imagem: foto9, legenda: "Nossa primeira fotos juntos que logo depois foi destruido pelo litle djalma " },
    { imagem: foto10, legenda: "Esse eu lembro que foi no casamento kkk, voce é muito linda meu amor❤️" },
    { imagem: foto11, legenda: "Nao vejo a hora de ficar todo os dias grudadinho com voce meu amor." },
    { imagem: foto12, legenda: "mai que mulherão, tenho sorte em ter voce na minha vida." },
    { imagem: foto16, legenda: "toda meigunha mal sabendo o que iria acontecer depois kkkk" },
    { imagem: foto22, legenda: "Como posso eu ser tao esquecido assim, nao lembro desse dia" },
    { imagem: foto15, legenda: "esse to gordin, nao que eu não esteja gordo.😭" },
    { imagem: foto25, legenda: "Que esse bocão seja meu pelo resto da vida. oia que bença" },
    { imagem: foto27, legenda: "Um gatinho e uma gatinha dormindo gostosin" },
    { imagem: foto28, legenda: "Nu😯" },


    
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
