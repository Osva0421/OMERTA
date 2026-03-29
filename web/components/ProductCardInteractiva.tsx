"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import Link from 'next/link';

// Componente para la tarjeta de producto interactiva que encapsula la galería al hacer hover
export function ProductCardInteractiva({ prod, esFavorito, toggleFavorito }: { prod: any; esFavorito: boolean; toggleFavorito: (prod: any) => void }) {
    const [indiceActivo, setIndiceActivo] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Funciones para iniciar y detener el carrusel al hacer hover
    const iniciarHover = () => {
        if (window.matchMedia("(min-width: 768px)").matches && prod.galeria && prod.galeria.length > 1) {
            // Inicia un temporizador para cambiar de imagen cada 1.2 segundos (1200ms)
            timerRef.current = setInterval(() => {
                setIndiceActivo((prev) => (prev + 1) % prod.galeria.length);
            }, 1200);
        }
    };

    const detenerHover = () => {
        // Limpia el temporizador y reinicia el índice
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setIndiceActivo(0);
    };

    // Limpia el temporizador si el componente se desmonta (maña de React)
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    return (
        <motion.div
            className="group relative flex flex-col cursor-pointer"
            onMouseEnter={iniciarHover}
            onMouseLeave={detenerHover}
        >
            {/* Botón de favoritos (el corazón de image_6.png) flote sobre la imagen */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorito(prod);
                }}
                className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full hover:scale-110 transition-transform shadow-sm"
            >
                <AnimatePresence>
                    <motion.div
                        key={esFavorito ? "full" : "empty"}
                        initial={{ scale: 1 }}
                        animate={{ scale: esFavorito ? [1, 1.3, 1] : 1 }}
                    >
                        <Heart size={16} className={esFavorito ? "fill-red-500 text-red-500" : "text-gray-400"} />
                    </motion.div>
                </AnimatePresence>
            </button>

            {/* Contenedor principal del carrusel de imágenes (estilo image_6.png) */}
            <div className="aspect-[4/5] bg-[#f8f8f8] rounded-2xl md:rounded-3xl overflow-hidden relative mb-4 shadow-sm group">
                <div
                    className="w-full h-full flex overflow-x-auto md:overflow-hidden snap-x snap-mandatory no-scrollbar relative z-10"
                >
                    {prod.galeria && prod.galeria.length > 0 ? (
                        prod.galeria.map((imgUrl: string, i: number) => (
                            <Link
                                key={i}
                                href={`/products/${prod.handle}`}
                                className="w-full h-full flex-none snap-center relative"
                                style={{
                                    transform: `translateX(-${indiceActivo * 100}%)`, // MÁGIA: Movimiento hacia la derecha
                                    transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' // Transición suave y premium para el movimiento
                                }}
                            >
                                <img
                                    src={imgUrl}
                                    alt={`${prod.name} - Vista ${i}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                />
                            </Link>
                        ))
                    ) : (
                        // Imagen de respaldo por si no hay galería
                        <Link href={`/products/${prod.handle}`} className="block w-full h-full">
                            <img
                                src={prod.img}
                                alt={prod.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                            />
                        </Link>
                    )}
                </div>

                {/* Botón de talla que se revela al hacer hover (revelación limpia como pediste) */}
                <div className="absolute bottom-0 w-full p-4 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 pointer-events-none md:pointer-events-auto relative z-20">
                    <Link href={`/products/${prod.handle}`} className="pointer-events-auto">
                        <div className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest text-[9px] text-center shadow-xl">
                            Selecciona tu talla
                        </div>
                    </Link>
                </div>
            </div>

            {/* Texto de nombre y precio (font-sans es Montserrat) */}
            <Link href={`/products/${prod.handle}`}>
                <h3 className="font-bold uppercase tracking-widest text-xs mb-1 truncate hover:text-gray-500 transition-colors">
                    {prod.name}
                </h3>
                <p className="text-gray-400 font-mono text-[10px]">{prod.price}</p>
            </Link>
        </motion.div>
    );
}