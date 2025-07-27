"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const generateDeck = () => {
  const memoryCards = [
    "public/images/Carta-AgencyFB-1.png",
    "public/images/Carta-ArialBlack-1.png",
    "public/images/Carta-Bauhaus93-1.png",
    "public/images/Carta-Broadway-1.png",
    "public/images/Carta-Calibri-1.png",
    "public/images/Carta-ComicSansMS-1.png",
    "public/images/Carta-EstrangeloEdessa-2.png",
    "public/images/Carta-LithosPro-1.png",
    "public/images/Carta-Mistral-1.png",
    "public/images/Carta-OpenSans-1.png",
    "public/images/Carta-SegoeUI-1.png",
    "public/images/Carta-SourceSansPro-1.png",
  ];

  const deck = [...memoryCards, ...memoryCards];
  return deck.sort(() => Math.random() - 0.5);
};

export default function MemoryGame() {
  const [cards, setCards] = useState<string[]>(generateDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);

  useEffect(() => {
    const checkForMatch = () => {
      const [first, second] = flipped;

      if (cards[first] === cards[second]) {
        setSolved([...solved, ...flipped]);
      }
      setFlipped([]);
    };

    if (flipped.length === 2) {
      setTimeout(() => {
        checkForMatch();
      }, 1000);
    }
  }, [cards, flipped, solved]);

  const handleClick = (index: number) => {
    if (!flipped.includes(index) && flipped.length < 2) {
      setFlipped([...flipped, index]);
    }
  };

  const gameOver = solved.length === cards.length;

  const resetGame = () => {
    setCards(generateDeck());
    setFlipped([]);
    setSolved([]);
  };

  return (
    <div className="text-center">
      <h1>Memory Game</h1>
      {gameOver && <h2 className="text-green-500 p-5">You WON! Congrats!</h2>}
      <div className="grid grid-cols-4 gap-5 mt-5">
        {cards.map((card, index) => (
          <div
            className={`flex justify-center text-4xl font-bold text-black items-center w-28 bg-slate-200 h-28 transform cursor-pointer transition-transform duration-300 ${
              flipped.includes(index) || solved.includes(index)
                ? "rotate-180"
                : ""
            }`}
            key={index}
            onClick={() => handleClick(index)}
          >
            {flipped.includes(index) || solved.includes(index) ? (
              <Image
                className="rotate-180"
                src={`/memory-cards/${card}.webp`}
                fill
                alt="Memory Card"
              />
            ) : (
              "public/images/Carta-Back.png"
            )}
          </div>
        ))}
      </div>
      <button
        onClick={resetGame}
        className="flex p-5 bg-slate-500 rounded-md mt-5"
      >
        Restart
      </button>
    </div>
  );
}