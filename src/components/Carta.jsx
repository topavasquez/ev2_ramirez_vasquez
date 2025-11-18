export function Carta({ cartasprops, eliminarcarta }) {
  const simbolos = {
    corazones: "♥",
    diamantes: "♦",
    treboles: "♣",
    picas: "♠",
  };

  const esRoja =
    cartasprops.pinta === "corazones" || cartasprops.pinta === "diamantes";

  return (
    <div
      className="card m-2 p-2 position-relative"
      style={{
        width: "120px",
        height: "170px",
        color: esRoja ? "red" : "black",
      }}
    >
      <div style={{ fontSize: "12px" }} className="fw-bold">
        {cartasprops.valor}
      </div>
      <div
        className="text-center"
        style={{ fontSize: "30px", marginTop: "10px" }}
      >
        {simbolos[cartasprops.pinta]}
      </div>
      <button
        className="btn btn-sm btn-danger position-absolute top-0 end-0"
        style={{ fontSize: "12px", padding: "4px 6px" }}
        onClick={eliminarcarta}
      >
        x
      </button>
    </div>
  );
}
