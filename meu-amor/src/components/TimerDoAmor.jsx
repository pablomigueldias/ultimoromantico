import { useState, useEffect } from "react";
import "./TimerDoAmor.css";

// DATA REAL DO NAMORO
const DATA_INICIO_RELACIONAMENTO = new Date(2023, 7, 19, 0, 0, 0);
// Lembrando: mês 7 = Agosto (pois começa do zero)

function calcularTempoReal(inicio) {
  const agora = new Date();

  let anos = agora.getFullYear() - inicio.getFullYear();
  let meses = agora.getMonth() - inicio.getMonth();
  let dias = agora.getDate() - inicio.getDate();
  let horas = agora.getHours() - inicio.getHours();
  let minutos = agora.getMinutes() - inicio.getMinutes();
  let segundos = agora.getSeconds() - inicio.getSeconds();

  // Ajustar segundos negativos
  if (segundos < 0) {
    segundos += 60;
    minutos--;
  }

  // Ajustar minutos negativos
  if (minutos < 0) {
    minutos += 60;
    horas--;
  }

  // Ajustar horas negativas
  if (horas < 0) {
    horas += 24;
    dias--;
  }

  // Ajustar dias negativos
  if (dias < 0) {
    const ultimoMes = new Date(agora.getFullYear(), agora.getMonth(), 0);
    dias += ultimoMes.getDate();
    meses--;
  }

  // Ajustar meses negativos
  if (meses < 0) {
    meses += 12;
    anos--;
  }

  return { anos, meses, dias, horas, minutos, segundos };
}

function TimerDoAmor() {
  const [tempo, setTempo] = useState(() =>
    calcularTempoReal(DATA_INICIO_RELACIONAMENTO)
  );

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTempo(calcularTempoReal(DATA_INICIO_RELACIONAMENTO));
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section className="timer">
      <h2>Nosso tempo juntos ⏰💖</h2>
      <p className="timer-subtitulo">
        Desde o dia 19/08/2023, já estamos juntos há:
      </p>

      <div className="timer-grid anos-grid">
        <div className="timer-box maior">
          <span className="timer-valor">{tempo.anos}</span>
          <span className="timer-label">{tempo.anos === 1 ? "ano" : "anos"}</span>
        </div>

        <div className="timer-box maior">
          <span className="timer-valor">{tempo.meses}</span>
          <span className="timer-label">
            {tempo.meses === 1 ? "mês" : "meses"}
          </span>
        </div>

        <div className="timer-box maior">
          <span className="timer-valor">{tempo.dias}</span>
          <span className="timer-label">
            {tempo.dias === 1 ? "dia" : "dias"}
          </span>
        </div>
      </div>

      <div className="timer-grid">
        <div className="timer-box">
          <span className="timer-valor">{pad(tempo.horas)}</span>
          <span className="timer-label">
            {tempo.horas === 1 ? "hora" : "horas"}
          </span>
        </div>

        <div className="timer-box">
          <span className="timer-valor">{pad(tempo.minutos)}</span>
          <span className="timer-label">
            {tempo.minutos === 1 ? "minuto" : "minutos"}
          </span>
        </div>

        <div className="timer-box">
          <span className="timer-valor">{pad(tempo.segundos)}</span>
          <span className="timer-label">
            {tempo.segundos === 1 ? "segundo" : "segundos"}
          </span>
        </div>
      </div>
    </section>
  );
}

export default TimerDoAmor;
