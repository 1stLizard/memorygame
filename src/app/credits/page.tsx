"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

// Componente de fondo con partículas animadas
function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; r: number; dx: number; dy: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(drawParticles);
    }

    drawParticles();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}

export default function CreditsPage() {
  const router = useRouter();

  const collaborators = [
    { name: "Cortez Cruz Kevin", role: "Ing. Sistemas", img: "/img/kevin.jpg" },
    { name: "Gutierrez Sanchez Alan Ivan", role: "Ing. Sistemas", img: "/img/alan.jpg" },
    { name: "Marcos Manuel Maya Sanchez", role: "Ing. sistemas", img: "/img/marcos.jpg" },
    { name: "Dominguez Chanona Joshep", role: "Lic. Diseño Grafico", img: "/img/joshep.jpg" },
    { name: "Dorantes Arriaga Iván", role: "Lic. Diseño Grafico", img: "/img/ivan.jpg" },
    { name: "Juarez Nuñez Yessenia", role: "Lic. Diseño Grafico", img: "/img/jessenia.jpg" },
    { name: "Quezada Sosa Sergio Alberto", role: "Lic. Diseño Grafico", img: "/img/alberto.jpg" },
    { name: "Solis Añorve Mayra", role: "Lic. Diseño Grafico", img: "/img/mayra.jpg" },
  ];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden p-6">
      {/* Fondo de partículas */}
      <ParticlesBackground />

      {/* Contenido con animación */}
      <motion.div
        className="relative z-10 bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-6xl w-full text-center border border-white/20"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-4xl font-extrabold mb-4 text-yellow-300 drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          🎮 Créditos
        </motion.h1>

        <motion.p
          className="mb-6 text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Este Memory Game fue desarrollado por un equipo increíble usando{" "}
          <span className="font-semibold text-green-300">Next.js</span>,{" "}
          <span className="font-semibold text-blue-300">TailwindCSS</span> y{" "}
          <span className="font-semibold text-pink-300">Framer Motion</span>.
        </motion.p>

        {/* Scroll horizontal con snap */}
        <div className="overflow-x-auto snap-x snap-mandatory scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-transparent">
          <motion.div
            className="grid grid-cols-4 gap-10 mt-8 px-6 min-w-[900px] mx-auto snap-x snap-mandatory"
            style={{ gridAutoRows: "1fr" }}
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            {collaborators.map((person, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg border border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/40 hover:border-yellow-400 snap-start"
                whileHover={{ scale: 1.07 }}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 20 },
                  visible: { opacity: 1, scale: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
              >
                <motion.img
                  src={person.img}
                  alt={person.name}
                  className="w-20 h-20 rounded-full border-2 border-yellow-300 object-cover shadow-md"
                  animate={{
                    boxShadow: [
                      "0 0 5px rgba(255, 215, 0, 0.5)",
                      "0 0 15px rgba(255, 215, 0, 0.8)",
                      "0 0 5px rgba(255, 215, 0, 0.5)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 0 25px rgba(255, 215, 0, 1)",
                  }}
                />
                <h3 className="mt-3 text-sm font-bold text-yellow-300 text-center">
                  {person.name}
                </h3>
                <p className="text-xs text-gray-200 text-center">{person.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.button
          onClick={() => router.push("/")}
          className="mt-8 px-6 py-2 bg-white text-indigo-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Volver al Juego
        </motion.button>
      </motion.div>
    </main>
  );
}

