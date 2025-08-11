"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MemoryGame from "../components/MemoryGame";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col items-center justify-center p-8 font-mono">
      {/* Título animado */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-extrabold mb-10 text-center tracking-widest text-neon"
      >
        🎮 MEMORY GAME
      </motion.h1>

      {/* Componente del juego */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="w-full max-w-4xl"
      >
        <MemoryGame />
      </motion.div>

      {/* Botón créditos */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/credits")}
        className="mt-10 px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white font-bold rounded-lg shadow-lg relative overflow-hidden hover:shadow-xl transition-all"
      >
        Ver Créditos
        <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition duration-300 blur-sm pointer-events-none" />
      </motion.button>

      {/* Pie de página opcional */}
      <p className="mt-6 text-sm text-gray-400">© 2025 KevinCortez Studios</p>
    </main>
  );
}

