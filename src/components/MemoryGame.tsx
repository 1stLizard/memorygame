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
  const [failures, setFailures] = useState(0); // SOLO los fallos
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const MAX_ATTEMPTS = 12;

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;

      setTimeout(() => {
        const isMatch = cards[first] === cards[second];

        if (isMatch) {
          setSolved(prev => [...prev, first, second]);
        } else {
          setFailures(prev => {
            const newFail = prev + 1;
            if (newFail >= MAX_ATTEMPTS) {
              setGameOver(true);
            }
            return newFail;
          });
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
    <div className="text-center p-6 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">🧠 Juego de Memoria</h1>

      {gameOver && solved.length === cards.length && (
        <h2 className="text-green-500 p-2 text-xl">¡Ganaste! 🎉</h2>
      )}

      {gameOver && failures >= MAX_ATTEMPTS && (
        <h2 className="text-red-500 p-2 text-xl">¡Perdiste! 😢</h2>
      )}

      <p className="text-lg mb-4">
        Intentos fallidos: {failures} / {MAX_ATTEMPTS}
      </p>

      <div className="grid grid-cols-4 gap-[40px] justify-center mb-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className="relative w-[180px] h-[200px] bg-gray-300 rounded-xl shadow-lg cursor-pointer"
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
    </div>
  );
}
