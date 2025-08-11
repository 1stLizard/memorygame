"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const generateDeck = () => {
  const memoryCards = [
    "Carta-AgencyFB-1.png",
    "Carta-ArialBlack-1.png",
    "Carta-Bauhaus93-1.png",
    "Carta-Broadway-1.png",
    "Carta-Calibri-1.png",
    "Carta-ComicSansMS-1.png",
    "Carta-LithosPro-1.png",
    "Carta-Mistral-1.png",
    "Carta-OpenSans-1.png",
    "Carta-SegoeUI-1.png",
    "Carta-SourceSansPro-1.png",
    "CartaStrangeloEdessa.png",
  ];
  const deck = [...memoryCards, ...memoryCards];
  return deck.sort(() => Math.random() - 0.5);
};

type RankingEntry = {
  time: number;
  attempts: number;
};

export default function MemoryGame() {
  const [cards, setCards] = useState<string[]>(generateDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [failures, setFailures] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;

      setTimeout(() => {
        const isMatch = cards[first] === cards[second];

        if (isMatch) {
          setSolved((prev) => [...prev, first, second]);
        } else {
          setFailures((prev) => prev + 1);
        }

        setFlipped([]);
      }, 1000);
    }
  }, [flipped]);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      const timeTaken = Date.now() - (startTime ?? Date.now());
      const newEntry: RankingEntry = {
        time: Math.floor(timeTaken / 1000),
        attempts: failures,
      };
      const updatedRanking = [...ranking, newEntry];
      setRanking(updatedRanking);
      localStorage.setItem("ranking", JSON.stringify(updatedRanking));
      setEndTime(Date.now());
      setGameOver(true);
    }
  }, [solved]);

  useEffect(() => {
    const savedRanking = localStorage.getItem("ranking");
    if (savedRanking) {
      setRanking(JSON.parse(savedRanking));
    }
  }, []);

  const handleClick = (index: number) => {
    if (
      !flipped.includes(index) &&
      flipped.length < 2 &&
      !solved.includes(index) &&
      !gameOver
    ) {
      if (startTime === null) setStartTime(Date.now());
      setFlipped([...flipped, index]);
    }
  };

  const resetGame = () => {
    setCards(generateDeck());
    setFlipped([]);
    setSolved([]);
    setFailures(0);
    setStartTime(null);
    setEndTime(null);
    setGameOver(false);
  };

  return (
    <div className="text-center p-6 bg-black min-h-screen text-white relative overflow-hidden">
      <h1 className="text-3xl font-bold mb-4">🧠 Juego de Memoria</h1>

      {/* Modal de victoria */}
      {gameOver && solved.length === cards.length && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white bg-opacity-90 text-black p-8 rounded-xl shadow-lg text-center max-w-sm">
            <h2 className="text-2xl font-bold mb-4">🎉 ¡Felicidades! 🎉</h2>
            <p className="text-lg mb-6">Lo has logrado, completaste el juego.</p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Jugar de nuevo
            </button>
          </div>
        </div>
      )}

      {/* Tablero de cartas */}
      <div className="grid grid-cols-6 gap-[10px] justify-center mb-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className="relative w-[100px] h-[120px] bg-gray-300 rounded-xl shadow-lg cursor-pointer"
          >
            {flipped.includes(index) || solved.includes(index) ? (
              <Image
                src={`/memory-cards/${card}`}
                alt="Carta frontal"
                fill
                className="object-cover rounded-xl"
              />
            ) : (
              <Image
                src="/memory-cards/Carta-Bocaabajo.png"
                alt="Carta trasera"
                fill
                className="object-cover rounded-xl"
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="mt-4 px-6 py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 transition"
      >
        Reanudar
      </button>

      <button
        onClick={() => setShowCredits(true)}
        className="mt-4 ml-4 px-6 py-3 bg-gray-700 text-white text-lg rounded-md hover:bg-gray-800 transition"
      >
        Créditos
      </button>

      {/* Tabla de ranking */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">🏆 Ranking</h2>
        <table className="w-full max-w-md mx-auto text-left border border-white">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2 border border-white">#</th>
              <th className="p-2 border border-white">Tiempo (s)</th>
              <th className="p-2 border border-white">Fallos</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((entry, i) => (
              <tr key={i} className="bg-gray-700">
                <td className="p-2 border border-white">{i + 1}</td>
                <td className="p-2 border border-white">{entry.time}</td>
                <td className="p-2 border border-white">{entry.attempts}</td>
              </tr>
            ))}
            {ranking.length === 0 && (
              <tr>
                <td colSpan={3} className="p-2 text-center text-gray-400">
                  No hay partidas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Créditos */}
      {showCredits && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-sm text-left relative">
            <h3 className="text-xl font-bold mb-4">Créditos</h3>
            <p className="mb-2">Desarrollador: Marcos Maya</p>
            <p className="mb-2">Proyecto: Juego de Memoria en Next.js</p>
            <p className="mb-4">Imágenes: Carpeta /public/memory-cards</p>
            <button
              onClick={() => setShowCredits(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              aria-label="Cerrar créditos"
            >
              ✖
            </button>
            <button
              onClick={() => setShowCredits(false)}
              className="mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
