"use client";

import { motion } from 'framer-motion';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-black">

            {/* NAV MÍNIMO Y OSCURO */}
            <nav className="p-6 flex justify-between items-center border-b border-white/5 z-50 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl">
                <Link href="/" className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase text-gray-400 hover:text-white transition-colors">
                    <ChevronLeft size={14} /> Volver a la base
                </Link>
                {/* Filtro invert para que el logo negro se vea blanco en el fondo oscuro */}
                <img src="/monograma-omerta.png" alt="OMERTA" className="h-8 md:h-10 filter invert opacity-90" />
                <div className="w-20"></div> {/* Espaciador para centrar el logo */}
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-24 md:py-32">

                {/* ENCABEZADO GIGANTE */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <h1 className="text-6xl md:text-[9rem] font-black italic tracking-tighter uppercase leading-[0.85] mb-8">
                        El Protocolo<br /><span className="text-gray-500">Omerta.</span>
                    </h1>
                    <p className="text-gray-400 font-mono text-xs md:text-sm uppercase tracking-[0.3em] max-w-2xl leading-relaxed border-l border-gray-600 pl-4">
                        Más que estética, es una declaración de principios. Estructura, anonimato y resistencia en el entorno urbano.
                    </p>
                </motion.div>

                {/* MANIFIESTO EN GRID */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-start">

                    {/* IMAGEN CONCEPTUAL (Lado Izquierdo) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.5 }}
                        className="md:col-span-5 aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden relative group"
                    >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=800"
                            alt="Textura OMERTA"
                            className="w-full h-full object-cover grayscale opacity-70 group-hover:scale-105 transition-transform duration-1000"
                        />
                    </motion.div>

                    {/* TEXTOS DEL MANIFIESTO (Lado Derecho) */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="md:col-span-7 space-y-16 pt-8 md:pt-12"
                    >
                        {/* Punto 1 */}
                        <div className="relative">
                            <span className="absolute -top-6 -left-4 text-6xl font-black text-white/5 italic z-0 select-none">01</span>
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest mb-4 relative z-10">Silencio Visual</h2>
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
                                En un mundo saturado de ruido y logotipos escandalosos, elegimos el silencio. OMERTA elimina lo innecesario. Colores sobrios, siluetas arquitectónicas y una ausencia deliberada de atención no deseada. El anonimato es el nuevo lujo.
                            </p>
                        </div>

                        {/* Punto 2 */}
                        <div className="relative">
                            <span className="absolute -top-6 -left-4 text-6xl font-black text-white/5 italic z-0 select-none">02</span>
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest mb-4 relative z-10">Ingeniería Urbana</h2>
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
                                No fabricamos simple ropa. Construimos armaduras para la ciudad. Cada prenda y todos nuestros accesorios están diseñados bajo estándares de alto rendimiento, pensados para resistir la fricción del día a día sin perder su estructura.
                            </p>
                        </div>

                        {/* Punto 3 (CORREGIDO) */}
                        <div className="relative">
                            <span className="absolute -top-6 -left-4 text-6xl font-black text-white/5 italic z-0 select-none">03</span>
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest mb-4 relative z-10">El Círculo</h2>
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
                                Pertenecer al archivo no es para cualquiera. Es para quienes entienden que la presencia más fuerte es aquella que no necesita gritar para dominar el espacio. Si entiendes el código, bienvenido al Círculo.
                            </p>
                        </div>

                        {/* Botón de Retorno */}
                        <div className="pt-12">
                            <Link href="/" className="inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                                Iniciar Adquisiciones <ArrowRight size={16} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>

            <footer className="border-t border-white/5 py-16 text-center mt-20 relative overflow-hidden">
                <div className="text-4xl md:text-6xl font-black tracking-[0.5em] mb-4 italic text-white/5 select-none">OMERTA</div>
                <p className="text-gray-600 text-[9px] uppercase tracking-widest font-mono relative z-10">© 2026 ARCHIVE PROTOCOL. CLASIFICADO.</p>
            </footer>
        </div>
    );
}