"use client";

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trash2, ArrowRight, Box, LayoutGrid, ShoppingBag, Heart } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '../store/useCartStore';

// --- COMPONENTE VISUALIZADOR 3D ---
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center } from '@react-three/drei';

function ModelView({ glb }: { glb: string }) {
    const { scene } = useGLTF(glb);
    return <Center><primitive object={scene} scale={4.5} /></Center>;
}

// --- COMPONENTE CORREGIDO: BARRA DE PROGRESO COMBINADA ---
function BarraEnvioGratis() {
    const obtenerTotalCarrito = useCartStore((state) => state.obtenerTotalCarrito);
    const favoritos = useCartStore((state) => state.favoritos);

    const totalCarrito = obtenerTotalCarrito();

    // Sumamos todo lo que está guardado en el clóset
    const totalCloset = favoritos.reduce((acc, item) => {
        const precioString = String(item.precio || item.price || "0");
        const precioNum = parseFloat(precioString.replace(/[^0-9.]/g, "")) || 0;
        return acc + (item.rawPrice || precioNum);
    }, 0);

    // El poder de la psicología: El total es lo que ya iban a comprar + lo que acaban de guardar
    const totalCombinado = totalCarrito + totalCloset;

    const META_ENVIO = 1050;
    const falta = Math.max(0, META_ENVIO - totalCombinado);
    const porcentaje = Math.min((totalCombinado / META_ENVIO) * 100, 100);

    return (
        <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
            <div className="flex justify-between items-end mb-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-black">
                    {totalCombinado >= META_ENVIO ? "¡ENVÍO GRATIS AL LLEVAR ESTO! 🚚" : "META: ENVÍO GRATIS 📦"}
                </p>
                {totalCombinado < META_ENVIO && (
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Faltan <span className="text-black font-black">${falta.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                    </p>
                )}
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden relative">
                <motion.div
                    className="h-full bg-black absolute top-0 left-0 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${porcentaje}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </div>

            {totalCombinado < META_ENVIO && (
                <p className="text-[9px] text-gray-400 mt-3 text-center uppercase tracking-widest">
                    Pasa todo tu archivo al carrito para no pagar envío.
                </p>
            )}
        </div>
    );
}
// --------------------------------------------------------

export default function ClosetPage() {
    const { favoritos, toggleFavorito, agregarPrenda, carrito } = useCartStore();
    const [isLoaded, setIsLoaded] = useState(false);
    const [itemSeleccionado, setItemSeleccionado] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'3D' | 'PHOTO'>('3D');

    useEffect(() => {
        setIsLoaded(true);
        if (favoritos.length > 0 && !itemSeleccionado) {
            setItemSeleccionado(favoritos[0]);
        }
    }, [favoritos]);

    if (!isLoaded) return <div className="min-h-screen bg-white" />;

    const totalCarrito = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);
    const totalCloset = favoritos.length;

    const totalVigilancia = favoritos.reduce((acc, item) => {
        const precioString = String(item.precio || item.price || "0");
        const precioNum = parseFloat(precioString.replace(/[^0-9.]/g, "")) || 0;
        return acc + precioNum;
    }, 0);

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white flex flex-col overflow-hidden">
            <nav className="p-4 md:p-6 flex justify-between items-center border-b border-gray-100 bg-white/80 backdrop-blur-md z-50 sticky top-0 flex-shrink-0">
                <Link href="/" className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase hover:opacity-50 transition-opacity">
                    <ChevronLeft size={14} /> <span className="hidden md:inline">Volver a la base</span>
                </Link>
                {/* LOGO TOCABLE QUE LLEVA AL INICIO */}
                <Link href="/" className="hover:scale-105 transition-transform">
                    <img src="/monograma-omerta.png" alt="OMERTA" className="h-8 md:h-10 object-contain" />
                </Link>
                <div className="flex items-center space-x-3 md:space-x-4 bg-black text-white px-4 md:px-6 py-2 rounded-full shadow-lg">
                    <div className="relative flex items-center gap-1.5">
                        <motion.div key={totalCloset} animate={{ scale: [1, 1.4, 1] }}><LayoutGrid size={16} className="text-red-500" /></motion.div>
                        <span className="text-[10px] font-black">{totalCloset}</span>
                    </div>
                    <div className="w-[1px] h-4 bg-zinc-800" />
                    <Link href="/carrito" className="relative flex items-center gap-1.5 hover:text-gray-300 transition-colors">
                        <motion.div key={totalCarrito} animate={{ scale: [1, 1.4, 1] }}><ShoppingBag size={16} /></motion.div>
                        <span className="text-[10px] font-black">{totalCarrito}</span>
                    </Link>
                </div>
            </nav>

            <main className="flex-1 flex flex-col-reverse lg:flex-row overflow-hidden relative">
                <section className="w-full lg:w-1/3 p-6 md:p-12 flex flex-col justify-center bg-white z-10 border-t lg:border-t-0 lg:border-r border-gray-100">
                    <AnimatePresence mode="wait">
                        {itemSeleccionado ? (
                            <motion.div key={itemSeleccionado.shopifyId || itemSeleccionado.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase italic mb-2">
                                    {itemSeleccionado.name}
                                </h1>
                                <p className="text-xl font-light text-gray-500 mb-6">{itemSeleccionado.precio || itemSeleccionado.price}</p>

                                {/* --- INYECTAMOS LA BARRA DE ENVÍO GRATIS AQUÍ --- */}
                                <BarraEnvioGratis />
                                {/* ------------------------------------------------ */}

                                <button
                                    onClick={() => {
                                        agregarPrenda(itemSeleccionado);
                                        toggleFavorito(itemSeleccionado); // La quitamos del clóset al comprar
                                        alert("¡Transferido al archivo principal!");
                                    }}
                                    className="w-full bg-black text-white py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 shadow-xl group"
                                >
                                    Añadir al carrito <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        ) : (
                            <div className="text-center">
                                <Box size={48} strokeWidth={1} className="text-gray-200 mx-auto mb-4" />
                                <p className="text-[10px] font-mono text-gray-400 uppercase italic">Selecciona unidad para inspección</p>
                            </div>
                        )}
                    </AnimatePresence>
                </section>

                <section className="flex-1 bg-[#fafafa] relative flex flex-col min-h-[45vh] lg:min-h-0">
                    <div className="absolute top-4 lg:top-8 left-1/2 -translate-x-1/2 z-20 flex bg-white/50 p-1 rounded-full backdrop-blur-md border border-gray-200">
                        <button onClick={() => setViewMode('3D')} className={`px-4 lg:px-6 py-2 rounded-full text-[9px] font-black uppercase transition-all ${viewMode === '3D' ? 'bg-black text-white shadow-md' : 'text-gray-500'}`}>360°</button>
                        <button onClick={() => setViewMode('PHOTO')} className={`px-4 lg:px-6 py-2 rounded-full text-[9px] font-black uppercase transition-all ${viewMode === 'PHOTO' ? 'bg-black text-white shadow-md' : 'text-gray-500'}`}>FOTO</button>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center relative p-4 lg:p-8 pt-16 w-full h-full">
                        <AnimatePresence mode="wait">
                            {itemSeleccionado && (
                                <motion.div key={(itemSeleccionado.shopifyId || itemSeleccionado.name) + viewMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                                    {viewMode === '3D' ? (
                                        <Canvas camera={{ position: [0, 0, 5] }}>
                                            <ambientLight intensity={2.5} /><spotLight position={[10, 10, 10]} />
                                            <Suspense fallback={null}><ModelView glb={itemSeleccionado.glb || '/playera.glb'} /></Suspense>
                                            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
                                        </Canvas>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center p-4 lg:p-12">
                                            <img src={itemSeleccionado.img} alt="Modelo" className="max-h-[40vh] lg:max-h-[70vh] w-auto object-contain drop-shadow-2xl" />
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </main>

            <section className="w-full bg-white border-t border-gray-200 flex-shrink-0 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="max-w-[1600px] mx-auto p-4 md:p-6">
                    <div className="flex justify-between items-end mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <Heart size={18} fill="black" />
                            <h2 className="text-sm md:text-lg font-black uppercase tracking-[0.2em] italic">Bajo Vigilancia</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-mono text-gray-400 uppercase">Total Closet</p>
                            <p className="text-sm font-black font-mono">${totalVigilancia.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</p>
                        </div>
                    </div>
                    <div className="flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar px-2">
                        <AnimatePresence>
                            {favoritos.map((item) => (
                                <motion.div key={item.shopifyId || item.name} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => setItemSeleccionado(item)} className={`w-36 md:w-44 flex-shrink-0 snap-center bg-white rounded-xl border overflow-hidden flex flex-col shadow-sm cursor-pointer transition-all ${itemSeleccionado?.shopifyId === item.shopifyId ? 'border-black ring-2 ring-black/10' : 'border-gray-200'}`}>
                                    <div className="h-32 md:h-40 bg-gray-50 relative overflow-hidden">
                                        <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                                        <button onClick={(e) => { e.stopPropagation(); toggleFavorito(item); if (itemSeleccionado?.shopifyId === item.shopifyId) setItemSeleccionado(null); }} className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 shadow-sm hover:scale-110 transition-transform"><Trash2 size={12} /></button>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1 bg-white justify-center items-center text-center">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest truncate w-full">{item.name}</h3>
                                        <p className="text-[10px] font-mono text-gray-500 mt-2 bg-gray-50 px-3 py-1 rounded-full">{item.precio || item.price}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </section>
        </div>
    );
}