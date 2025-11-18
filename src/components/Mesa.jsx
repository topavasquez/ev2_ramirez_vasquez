import { Fragment } from "react/jsx-runtime";
import { Carta } from "./Carta";
import { React, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export function Mesa() {
  const [cartas, setCartas] = useState([]);
  const [crearCarta, setCrearCarta] = useState(false);
  const [validar, setValidar] = useState(null);
  const [mensajeResultado, setMensajeResultado] = useState("");

  function agregarCarta() {
    if (cartas.length >= 12) {
      alert("ya se agregaron 12 cartas");
      return;
    }

    const valor = document.getElementById("valor");
    const pinta = document.getElementById("pinta");

    const nuevaCarta = {
      valor: valor.value,
      pinta: pinta.value,
    };
    setCartas([...cartas, nuevaCarta]);
    setCrearCarta(true);
  }

  function eliminarcarta(indexAEliminar) {
    const nuevasCartas = cartas.filter((index) => index !== indexAEliminar);
    setCartas(nuevasCartas);
  }

  function validarJuego() {
    if (cartas.length !== 12) {
      alert("se necesitan 12 cartas antes de validar el juego");
      return;
    }
    const conteoValores = {};
    cartas.forEach((carta) => {
      if (conteoValores[carta.valor]) {
        conteoValores[carta.valor]++;
      } else {
        conteoValores[carta.valor] = 1;
      }
    });

    let triosCompletos = 0;
    const detallesTrios = [];

    Object.entries(conteoValores).forEach(([valor, cantidad]) => {
      const triosDeEsteValor = Math.floor(cantidad / 3);
      triosCompletos += triosDeEsteValor;
      if (triosDeEsteValor > 0) {
        detallesTrios.push(`${triosDeEsteValor} trío(s) de ${valor}`);
      }
    });

    if (triosCompletos >= 3) {
      setValidar(true);
      setMensajeResultado(`¡JUEGO VALIDO! ${triosCompletos} TRIOS`);
      guardarJuegoEnFirebase();
    } else {
      setValidar(false);
      setMensajeResultado("NO FORMA JUEGO :C");
    }
  }

  async function guardarJuegoEnFirebase() {
    try {
      const juegoOrdenado = [...cartas]
        .map((c) => `${c.valor}-${c.pinta}`)
        .sort()
        .join(",");

      const q = query(
        collection(db, "carioca"),
        where("juegoId", "==", juegoOrdenado)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("Este juego ya fue registrado anteriormente");
        return;
      }

      // guardar el juego en Firebase
      await addDoc(collection(db, "carioca"), {
        cartas: cartas.map((c) => ({ valor: c.valor, pinta: c.pinta })),
        juegoId: juegoOrdenado,
        fecha: new Date().toISOString(),
      });

      alert("el juego se guardo en firebase");
    } catch (error) {
      alert("Error al guardar el juego: " + error.message);
    }
  }

  return (
    <Fragment>
      <div>
        <h1>Mesa</h1>

        <input type="text" name="valor" id="valor" placeholder="Valor" />

        <select name="pinta" id="pinta">
          <option value="corazones">♥</option>
          <option value="diamantes">♦</option>
          <option value="treboles">♣</option>
          <option value="picas">♠</option>
        </select>

        <button onClick={agregarCarta}> Agregar +</button>
        <button className="btn btn-success ms-2" onClick={validarJuego}>
          Validar Juego
        </button>
      </div>
      <div>
        <h2>Cartas</h2>

        <AnimatePresence mode="wait">
          {validar !== null && (
            <motion.h1
              key={mensajeResultado}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 0.5,
                type: "spring",
                bounce: 0.6,
              }}
              style={{
                color: validar ? "green" : "red",
                marginBottom: "20px",
              }}
            >
              {mensajeResultado}
            </motion.h1>
          )}
        </AnimatePresence>

        <div style={{ display: "flex", flexWrap: "wrap", maxWidth: "1500px" }}>
          <AnimatePresence>
            {cartas.map((carta, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Carta
                  cartasprops={carta}
                  eliminarcarta={() => eliminarcarta(carta)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Fragment>
  );
}
