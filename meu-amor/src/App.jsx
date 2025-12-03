import { useRef } from "react";
import "./App.css";
import CabecalhoDeclaracao from "./components/CabecalhoDeclaracao";
import TimerDoAmor from "./components/TimerDoAmor";
import GaleriaMomentos from "./components/GaleriaMomentos";
import CartasParaVoce from "./components/CartasParaVoce";
import LoveMusicPlayer from "./components/LoveMusicPlayer";
import MensagemSecreta from "./components/MensagemSecreta";
import CalendarioDoAmor from "./components/CalendarioDoAmor";
import CartaDoAmor from "./components/CartaDoAmor";

function App() {
  const musicPlayerRef = useRef(null);

  function handleVideoStart() {
    // pausa a música enquanto o vídeo de aniversário estiver tocando
    if (musicPlayerRef.current?.pauseForVideo) {
      musicPlayerRef.current.pauseForVideo();
    }
  }

  function handleVideoEnd() {
    // quando o vídeo acabar, volta a tocar se já estava tocando antes
    if (musicPlayerRef.current?.resumeAfterVideo) {
      musicPlayerRef.current.resumeAfterVideo();
    }
  }

  return (
    <div className="app">
      <div className="overlay">
        <main className="card">
          <CabecalhoDeclaracao />

          <TimerDoAmor />

          {/* Player de música, agora controlável via ref */}
          <LoveMusicPlayer ref={musicPlayerRef} />

          <GaleriaMomentos />

          <CartasParaVoce />

          <CalendarioDoAmor />

          <CartaDoAmor />

          {/* Mensagem secreta com controle da música via callbacks */}
          <MensagemSecreta
            onVideoStart={handleVideoStart}
            onVideoEnd={handleVideoEnd}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
