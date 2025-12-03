import "./BotaoContinuar.css";

function BotaoContinuar() {
  const handleClick = () => {
    // depois a gente coloca aqui pra mostrar a "segunda parte" da declaração
    alert("Em breve: a continuação dessa história linda 💖");
  };

  return (
    <button className="botao" onClick={handleClick}>
      Clique aqui para continuar essa história
    </button>
  );
}

export default BotaoContinuar;
