// src/components/CalendarioDoAmor.jsx
import { useState } from "react";
import "./CalendarioDoAmor.css";

const MOMENTOS = [
    {
        id: "aniversario-dela",
        data: "12/03",
        titulo: "Aniversário dela 🎂",
        tag: "Data favorita do ano",
        descricao:
            "O dia que o mundo ficou oficialmente mais bonito, porque você chegou nele. Desde que te conheci, essa data ganhou um significado totalmente diferente pra mim.",
        imagem: "/images/calendario/aniversario-dela.jpg", // troque pelo caminho real se tiver
    },
    {
        id: "primeiro-beijo",
        data: "27/05",
        titulo: "Nosso primeiro beijo 💋",
        tag: "Início oficial da bagunça",
        descricao:
            "Aquele beijo que mudou tudo. A partir dali, qualquer lugar com você começou a parecer o melhor lugar do mundo.",
        imagem: "/images/calendario/primeiro-beijo.jpg",
    },
    {
        id: "aniversario-namoro",
        data: "10/08",
        titulo: "Aniversário de namoro 💘",
        tag: "Mais um ano sendo seu",
        descricao:
            "Cada ano ao seu lado parece passar voando, mas ao mesmo tempo dá aquela sensação de que a gente já se conhece há vidas.",
        imagem: "/images/calendario/aniversario-namoro.jpg",
    },
    {
        id: "surpresa",
        data: "??/??",
        titulo: "Surpresa em construção 🎁",
        tag: "Vem coisa boa por aí",
        descricao:
            "Tem coisa que eu ainda nem escrevi aqui, mas já tô planejando viver com você. Esse espaço é pra tudo que ainda vamos criar juntos.",
        imagem: "/images/calendario/surpresa.jpg",
    },
];

export default function CalendarioDoAmor() {
    const [selecionado, setSelecionado] = useState(MOMENTOS[0]);

    return (
        <div className="calendario-amor-container">
            <div className="calendario-amor-card">
                <h2 className="calendario-titulo">Calendário do nosso amor 🗓️💖</h2>
                <p className="calendario-subtitulo">
                    Algumas datas que não são só números… são capítulos da nossa história.
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
                                    <span>✨ Nosso momento</span>
                                </div>
                            </div>
                        )}

                        <p className="calendario-detalhe-rodape">
                            Clica nas outras datas ao lado pra reviver mais um pedacinho da
                            nossa história. 💞
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
