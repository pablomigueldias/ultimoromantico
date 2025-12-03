// src/components/CalendarioDoAmor.jsx
import { useState } from "react";
import "./CalendarioDoAmor.css";
import foto25 from "../img/img25.jpg";
import foto13 from "../img/img13.jpg";
import foto16 from "../img/img16.jpg";
import foto11 from "../img/img11.jpg";

const MOMENTOS = [
    {
        id: "aniversario-dela",
        data: "04/12",
        titulo: "Aniversário dela 🎂",
        tag: "Data favorita do ano",
        descricao:
            "O dia que o mundo ficou oficialmente mais bonito, porque você chegou nele. Desde que te conheci e voce é o maior presente que eu poderia receber.",
        imagem: foto25, 
    },
    {
        id: "primeiro-beijo",
        data: "10/07",
        titulo: "Nosso primeiro beijo 💋",
        tag: "COMEÇOU TUDO",
        descricao:
            "A gente não tem foto daquele momento, e eu nem lembro o dia exato… Mas eu lembro da cena. A gente na esquina, na frente do bar, esperando o Uber… e eu criando coragem até finalmente te beijar primeiro. SIM FOI EU QUE BEIJEI VOCÊ PRIMEIRO!🙄",
        imagem: foto13,
    },
    {
        id: "aniversario-namoro",
        data: "19/08",
        titulo: "Aniversário de namoro 💘",
        tag: "O maior acerto da minha vida",
        descricao:
            "Espero que eu comemore esse dia com você por muitos e muitos anos. eu sou muito grato por ter você ao meu lado.",
        imagem: foto16,
    },
    {
        id: "surpresa",
        data: "??/??",
        titulo: "Surpresa em construção 🎁",
        tag: "Vem coisa aí",
        descricao:
            "Vou te bota no meu nome e te dar uma surpresa que você nunca mais vai esquecer. Só me aguarde.",
        imagem: foto11,
    },
];

export default function CalendarioDoAmor() {
    const [selecionado, setSelecionado] = useState(MOMENTOS[0]);

    return (
        <div className="calendario-amor-container">
            <div className="calendario-amor-card">
                <h2 className="calendario-titulo">Calendário do nosso amor 🗓️💖</h2>
                <p className="calendario-subtitulo">
                    Alguns momentos que tivemos com datas totalmente erradas foi mal é meu jeitinho. vou precisar da sua ajuda pra lembrar direitinho a mulher das datas.
                </p>

                <div className="calendario-layout">
                    {/* Coluna esquerda: "calendário" de datas */}
                    <div className="calendario-datas">
                        {MOMENTOS.map((momento) => (
                            <button
                                key={momento.id}
                                className={`calendario-data-item ${selecionado.id === momento.id ? "ativo" : ""
                                    }`}
                                onClick={() => setSelecionado(momento)}
                            >
                                <span className="calendario-data-badge">{momento.data}</span>
                                <div className="calendario-data-textos">
                                    <span className="calendario-data-titulo">
                                        {momento.titulo}
                                    </span>
                                    <span className="calendario-data-tag">{momento.tag}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Coluna direita: detalhe do momento escolhido */}
                    <div
                        key={selecionado.id}
                        className="calendario-detalhe calendario-detalhe-animado"
                    >
                        <div className="calendario-detalhe-header">
                            <span className="calendario-detalhe-data">
                                📅 {selecionado.data}
                            </span>
                            <h3 className="calendario-detalhe-titulo">
                                {selecionado.titulo}
                            </h3>
                        </div>

                        <p className="calendario-detalhe-descricao">
                            {selecionado.descricao}
                        </p>

                        {selecionado.imagem && (
                            <div className="calendario-detalhe-imagem-wrapper">
                                <img
                                    src={selecionado.imagem}
                                    alt={selecionado.titulo}
                                    className="calendario-detalhe-imagem"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                                <div className="calendario-detalhe-imagem-overlay">
                                    <span>✨ Minha vida</span>
                                </div>
                            </div>
                        )}

                        <p className="calendario-detalhe-rodape">
                          💞
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
