"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trash2, ArrowRight, Box, LayoutGrid, ShoppingBag, Heart } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '../store/useCartStore';
import { getProduct, getProducts } from '../lib/shopify';

// --- BARRA DE ENVÍO ---
function BarraEnvioGratis() {
    const obtenerTotalCarrito = useCartStore((state) => state.obtenerTotalCarrito);
    const favoritos = useCartStore((state) => state.favoritos);
    const totalCarrito = obtenerTotalCarrito();
    const totalCloset = favoritos.reduce((acc, item) => acc + (parseFloat(String(item.precio || item.price).replace(/[^0-9.]/g, "")) || 0), 0);
    const totalCombinado = totalCarrito + totalCloset;
    const META_ENVIO = 1050;
    const falta = Math.max(0, META_ENVIO - totalCombinado);
    const porcentaje = Math.min((totalCombinado / META_ENVIO) * 100, 100);

    return (
        <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
            <div className="flex justify-between items-end mb-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-black">
                    {totalCombinado >= META_ENVIO ? "¡ENVÍO GRATIS! 🚚" : "META: ENVÍO GRATIS 📦"}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Faltan <span className="text-black font-black">${falta.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                </p>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div className="h-full bg-black" initial={{ width: 0 }} animate={{ width: `${porcentaje}%` }} transition={{ duration: 0.8 }} />
            </div>
        </div>
    );
}

const extraerDatosVariante = (nombreCompleto: string) => {
    const partes = nombreCompleto.split(' (');
    const titulo = partes[0];
    const variante = partes[1] ? partes[1].replace(')', '') : 'Unitalla';
    return { titulo, variante };
};

export default function ClosetPage() {
    const { favoritos, toggleFavorito, agregarPrenda, carrito } = useCartStore();
    const [isLoaded, setIsLoaded] = useState(false);
    const [itemSeleccionado, setItemSeleccionado] = useState<any>(null);
    const [galeriaFiltrada, setGaleriaFiltrada] = useState<any[]>([]);
    const [imagenActiva, setImagenActiva] = useState<string>('');

    useEffect(() => {
        setIsLoaded(true);
        if (favoritos.length > 0 && !itemSeleccionado) {
            setItemSeleccionado(favoritos[0]);
        } else if (favoritos.length === 0) {
            setItemSeleccionado(null);
        }
    }, [favoritos]);

    // --- LÓGICA DE GALERÍA REFORZADA ---
    useEffect(() => {
        async function fetchGaleria() {
            if (!itemSeleccionado) return;

            setImagenActiva(itemSeleccionado.img);
            setGaleriaFiltrada([{ node: { url: itemSeleccionado.img } }]);

            try {
                const { titulo, variante } = extraerDatosVariante(itemSeleccionado.name);
                const colorPalabra = variante.split('-')[0].trim().toLowerCase();

                const catalogo = await getProducts();
                const match = catalogo.find((p: any) =>
                    titulo.toLowerCase().includes(p.node.title.toLowerCase()) ||
                    p.node.title.toLowerCase().includes(titulo.toLowerCase())
                );

                if (match) {
                    const fullProduct = await getProduct(match.node.handle);
                    if (fullProduct) {
                        const fotosColor = fullProduct.images.edges.filter((img: any) => {
                            if (!img.node.altText) return false; // Si Shopify no tiene Alt Text, la ignoramos
                            const alt = img.node.altText.toLowerCase();
                            return alt.includes(colorPalabra);
                        });

                        // REGLA ESTRICTA ANTI-SATURACIÓN:
                        if (fotosColor.length > 0) {
                            setGaleriaFiltrada(fotosColor); // Mostramos la galería solo si encontró el color
                        } else {
                            // Si falla, SOLO mostramos la foto principal. Cero saturación de colores mezclados.
                            setGaleriaFiltrada([{ node: { url: itemSeleccionado.img } }]);
                        }
                    }
                }
            } catch (e) { console.error("Error Galería:", e); }
        }
        fetchGaleria();
    }, [itemSeleccionado]);

    if (!isLoaded) return null;

    const totalVigilancia = favoritos.reduce((acc, item) => acc + (parseFloat(String(item.precio || item.price).replace(/[^0-9.]/g, "")) || 0), 0);
    const infoActual = itemSeleccionado ? extraerDatosVariante(itemSeleccionado.name) : { titulo: '', variante: '' };

    return (
        <div className="min-h-screen bg-white text-black font-sans flex flex-col overflow-hidden">
            <nav className="p-4 md:p-6 flex justify-between items-center border-b border-gray-100 bg-white/80 backdrop-blur-md z-50 sticky top-0">
                <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ChevronLeft size={14} /> Base</Link>
                <Link href="/"><img src="/monograma-omerta.png" alt="OMERTA" className="h-8 md:h-10" /></Link>
                <div className="flex items-center space-x-4 bg-black text-white px-5 py-2 rounded-full shadow-xl">
                    <div className="flex items-center gap-2"><LayoutGrid size={16} className="text-red-500 fill-red-500" /> <span className="text-[10px] font-black">{favoritos.length}</span></div>
                    <div className="w-[1px] h-4 bg-zinc-800" />
                    <Link href="/carrito" className="flex items-center gap-2"><ShoppingBag size={16} /> <span className="text-[10px] font-black">{carrito.length}</span></Link>
                </div>
            </nav>

            <main className="flex-1 flex flex-col-reverse lg:flex-row overflow-hidden">
                {/* TEXTOS */}
                <section className="w-full lg:w-1/3 p-8 lg:p-16 flex flex-col justify-center border-r border-gray-100 bg-white z-10">
                    <AnimatePresence mode="wait">
                        {itemSeleccionado && (
                            <motion.div key={itemSeleccionado.shopifyId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                                <h1 className="text-4xl lg:text-6xl font-black uppercase italic mb-4 leading-none">{infoActual.titulo}</h1>
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="text-2xl font-mono text-gray-400">{itemSeleccionado.precio || itemSeleccionado.price}</span>
                                    <span className="bg-gray-100 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{infoActual.variante}</span>
                                </div>
                                <BarraEnvioGratis />
                                <button onClick={() => { agregarPrenda(itemSeleccionado); toggleFavorito(itemSeleccionado); }} className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl">
                                    <ShoppingBag size={18} /> Mover al Carrito <ArrowRight size={16} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* --- VISUALIZADOR CENTRAL CON GALERÍA DERECHA --- */}
                <section className="flex-1 bg-[#fafafa] flex items-center justify-center p-6 lg:p-12 relative">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full max-w-6xl h-full">

                        {/* FOTO PRINCIPAL (TAMAÑO PC AJUSTADO) */}
                        <div className="relative flex-1 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                {imagenActiva && (
                                    <motion.img
                                        key={imagenActiva}
                                        src={imagenActiva}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="max-h-[45vh] lg:max-h-[65vh] w-auto object-contain drop-shadow-2xl z-10"
                                    />
                                )}
                            </AnimatePresence>
                            <div className="absolute inset-0 flex items-center justify-center text-[12vw] font-black text-black/[0.02] uppercase italic pointer-events-none">OMERTA</div>
                        </div>

                        {/* GALERÍA MINIATURAS (DERECHA) */}
                        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar pb-2 lg:pb-0 z-20 lg:w-24">
                            {galeriaFiltrada.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setImagenActiva(img.node.url)}
                                    className={`w-16 lg:w-full aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all flex-none bg-white ${imagenActiva === img.node.url ? 'border-black scale-105 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                >
                                    <img src={img.node.url} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* RACK INFERIOR CON BASURA */}
            <section className="bg-white border-t border-gray-100 p-6 z-30 shadow-2xl flex-shrink-0">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6 px-2">
                        <div className="flex items-center gap-2 font-black uppercase italic"><Heart size={18} fill="black" /> BAJO VIGILANCIA</div>
                        <div className="font-mono text-sm font-black text-gray-400">${totalVigilancia.toLocaleString()} MXN</div>
                    </div>

                    <div className="flex overflow-x-auto gap-4 md:gap-6 no-scrollbar pb-4 pt-2">
                        {favoritos.map((item) => (
                            <motion.div
                                key={item.shopifyId}
                                layout
                                whileHover={{ y: -10, rotate: [-1, 1, -1, 0] }}
                                style={{ transformOrigin: "top center" }}
                                onClick={() => setItemSeleccionado(item)}
                                className={`group w-36 md:w-44 flex-shrink-0 bg-white border rounded-2xl overflow-hidden cursor-pointer relative shadow-sm transition-all ${itemSeleccionado?.shopifyId === item.shopifyId ? 'border-black ring-2 ring-black/5' : 'border-gray-100'}`}
                            >
                                <div className="h-40 bg-gray-50 p-4 relative flex items-center justify-center overflow-hidden">
                                    <img src={item.img} className="w-full h-full object-contain" />
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-300 rounded-b-full" />

                                    {/* ICONO BASURA */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleFavorito(item); }}
                                        className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-red-500 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95 z-20"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="p-3 text-center">
                                    <p className="text-[9px] font-black uppercase truncate">{extraerDatosVariante(item.name).titulo}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}