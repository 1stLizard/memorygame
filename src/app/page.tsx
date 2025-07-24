"use client";

import React, { useState, useEffect } from "react";

type CardType = {
  id: number;
  image: string;
  matched: boolean;
};

type RankingEntry = {
  time: number;
  attempts: number;
};

const generateShuffledCards = (): CardType[] => {
  const cards: CardType[] = [];

  for (let i = 1; i <= 8; i++) {
    cards.push({ id: i * 2 - 1, image: `/images/${i}.png`, matched: false });
    cards.push({ id: i * 2, image: `/images/${i}.png`, matched: false });
  }

  return cards.sort(() => Math.random() - 0.5);
};

export default function Home() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [rankings, setRankings] = useState<RankingEntry[]>([]);

  // Cronómetro
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    resetGame();
    const stored = localStorage.getItem("memorama-rankings");
    if (stored) {
      setRankings(JSON.parse(stored));
    }
  }, []);

  const resetGame = () => {
    setCards(generateShuffledCards());
    setSelected([]);
    setMatchedIds([]);
    setAttempts(0);
    setTimer(0);
    setIsRunning(true);
  };

  const handleCardClick = (index: number) => {
    if (selected.length === 2 || selected.includes(index)) return;

    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      const isMatch = cards[first].image === cards[second].image;

      setTimeout(() => {
        if (isMatch) {
          setMatchedIds((prev) => [...prev, cards[first].id, cards[second].id]);
        }
        setSelected([]);
        setAttempts((prev) => prev + 1);
      }, 1000);
    }
  };

  useEffect(() => {
    const allMatched = cards.length > 0 && matchedIds.length === cards.length;
    if (allMatched) {
      setIsRunning(false);
      const newEntry = { time: timer, attempts };
      const updated = [...rankings, newEntry].sort((a, b) => {
        if (a.time === b.time) return a.attempts - b.attempts;
        return a.time - b.time;
      }).slice(0, 5);
      setRankings(updated);
      localStorage.setItem("memorama-rankings", JSON.stringify(updated));
    }
  }, [matchedIds]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-800 to-black text-white py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-4">🎮 App Memorama</h1>

      <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
        <div>⏱️ Tiempo: {timer}s</div>
        <div>❌ Intentos: {attempts}</div>
        <button
          onClick={resetGame}
          className="bg-yellow-400 text-black px-4 py-2 rounded-xl hover:bg-yellow-300 transition"
        >
          Reiniciar
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
        {cards.map((card, index) => {
          const isFlipped =
            selected.includes(index) || matchedIds.includes(card.id);
          return (
            <div
              key={index}
              onClick={() => handleCardClick(index)}
              className="cursor-pointer border-4 border-yellow-400 rounded-xl overflow-hidden shadow-xl transition-transform duration-300"
            >
              <img
                src={isFlipped ? card.image : "/images/t800.png"}
                alt="card"
                className="w-full h-28 object-cover"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-10 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">🏆 Ranking</h2>
        <ul className="bg-white text-black rounded-xl shadow-lg p-4 space-y-2">
          {rankings.length === 0 ? (
            <li className="text-center">No hay registros aún.</li>
          ) : (
            rankings.map((entry, i) => (
              <li key={i} className="flex justify-between">
                <span>#{i + 1}</span>
                <span>Tiempo: {entry.time}s</span>
                <span>Intentos: {entry.attempts}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
