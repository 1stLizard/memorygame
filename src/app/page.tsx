"use client";

import MemoryGame from "../components/MemoryGame";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-100">
      {/* Juego */}
      <MemoryGame />

      {/* Botón Créditos */}
      <button
        onClick={() => router.push("/credits")}
        className="mt-6 px-6 py-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg relative overflow-hidden group hover:scale-105 transition"
      >
        Créditos
        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition duration-300 blur-xl"></span>
      </button>
    </main>
  );
}


