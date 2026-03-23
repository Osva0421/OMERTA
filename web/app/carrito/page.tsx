"use client";

import { useEffect, useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { Trash2, ArrowLeft, CreditCard, ShoppingBag, Search, LayoutGrid, Bell, User } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { crearCheckout } from '../lib/shopify';

// --- COMPONENTE CORREGIDO: BARRA DE PROGRESO EN VIVO ---
function BarraEnvioGratisCarrito() {
    // FIX: Escuchamos los cambios del carrito directamente para que reaccione al + y -
    const carrito = useCartStore((state) => state.carrito);
    const obtenerTotalCarrito = useCartStore((state) => state.obtenerTotalCarrito);

    // El cálculo se hace al vuelo en cada render, sin useEffect
    const total = obtenerTotalCarrito();

    const META_ENVIO = 1050;
    const falta = Math.max(0, META_ENVIO - total);
    const porcentaje = Math.min((total / META_ENVIO) * 100, 100);

    return (
        <div className="w-full bg-white p-6 rounded-[30px] border border-gray-100 mb-8 shadow-sm">
            <div className="flex justify-between items-end mb-3">
                <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-black">
                    {total >= META_ENVIO ? "¡ENVÍO GRATIS DESBLOQUEADO! 🚚" : "META: ENVÍO GRATIS 📦"}
                </p>
                {total < META_ENVIO && (
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Faltan <span className="text-black font-black">${falta.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                    </p>
                )}
            </div>

            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden relative">
                <motion.div
                    className="h-full bg-black absolute top-0 left-0 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${porcentaje}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </div>

            {total > 0 && total < META_ENVIO && (
                <p className="text-[9px] md:text-[10px] text-gray-400 mt-4 text-center uppercase tracking-widest">
                    Agrega más artículos al archivo para no pagar envío en tu checkout.
                </p>
            )}
        </div>
    );
}
// --------------------------------------------------------

export default function CarritoPage() {
    const { carrito = [], favoritos = [], eliminarPrenda, actualizarCantidad, obtenerTotalCarrito } = useCartStore();
    const [cargando, setCargando] = useState(false);

    // Variables de sesión rápida para el Navbar
    const [isLoggedIn] = useState(false);
    const userName = "Osva";

    // --- ESCUDO DE HIDRATACIÓN ---
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    // Matemáticas para los globitos del Navbar
    const cantidadTotalCarrito = carrito?.reduce((total, item) => total + (item.cantidad || 1), 0) || 0;
    const cantidadTotalCloset = favoritos?.length || 0;

    if (!mounted) {
        return <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-black animate-pulse">Sincronizando Archivo...</div>;
    }

    // FIX 2: Usamos la función global para el total en lugar del reduce complejo
    const subtotal = obtenerTotalCarrito();

    const handleCheckout = async () => {
        setCargando(true);
        try {
            // Mandamos el "carrito" a Shopify
            const url = await crearCheckout(carrito || []);
            if (url) {
                window.location.href = url;
            } else {
                alert("Hubo un error de conexión con la bóveda de Shopify. Revisa que no haya productos inválidos.");
            }
        } catch (error) {
            console.error("Error en checkout:", error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-black font-sans flex flex-col selection:bg-black selection:text-white">

            {/* --- EL NUEVO NAVBAR (PÍLDORA NEGRA) --- */}
            <header className="bg-white/80 backdrop-blur-md text-black px-4 py-4 sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
                    {/* LOGO TOCABLE QUE LLEVA AL INICIO */}
                    <Link href="/" className="flex-shrink-0">
                        <img src="/monograma-omerta.png" alt="OMERTA" className="h-10 md:h-12 w-auto hover:scale-105 transition-transform" />
                    </Link>

                    {/* BUSCADOR */}
                    <div className="flex-1 max-w-xl mx-auto hidden md:block">
                        <div className="flex items-center bg-white rounded-full px-5 py-2.5 border border-gray-200 shadow-inner focus-within:border-black transition-colors">
                            <Search size={16} className="text-gray-400 mr-3" />
                            <input type="text" placeholder="Buscar en el archivo..." className="w-full bg-transparent outline-none text-xs font-medium" />
                        </div>
                    </div>

                    {/* PÍLDORA NEGRA SIMÉTRICA (Sin separador) */}
                    <div className="flex items-center space-x-5 md:space-x-8 text-[10px] font-black uppercase tracking-widest bg-black text-white px-6 py-3 rounded-full shadow-xl">

                        <Link href="/closet" className="flex items-center gap-2 relative hover:text-gray-300 transition-colors">
                            <LayoutGrid size={16} />
                            <span className="hidden lg:inline">Closet</span>
                            {/* --- ANIMACIÓN REBOTE CLOSET NAVBAR --- */}
                            {cantidadTotalCloset > 0 && (
                                <motion.span
                                    key={cantidadTotalCloset}
                                    initial={{ scale: 0.5, y: 5 }}
                                    animate={{ scale: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="absolute -top-2 -right-3 bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-black shadow-sm"
                                >
                                    {cantidadTotalCloset}
                                </motion.span>
                            )}
                        </Link>

                        <button className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                            <Bell size={16} />
                            <span className="hidden lg:inline">Notificaciones</span>
                        </button>

                        <Link href="/login" className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                            <User size={16} />
                            <span className="hidden lg:inline">{isLoggedIn ? userName : 'Entrar'}</span>
                        </Link>

                        <Link href="/carrito" className="flex items-center gap-2 relative hover:text-gray-300 transition-colors">
                            <ShoppingBag size={16} />
                            <span className="hidden lg:inline">Carrito</span>
                            {/* --- ANIMACIÓN REBOTE CARRITO NAVBAR --- */}
                            {cantidadTotalCarrito > 0 && (
                                <motion.span
                                    key={cantidadTotalCarrito}
                                    initial={{ scale: 0.5, y: 5 }}
                                    animate={{ scale: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="absolute -top-2 -right-3 bg-white text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-black shadow-sm"
                                >
                                    {cantidadTotalCarrito}
                                </motion.span>
                            )}
                        </Link>
                    </div>
                </div>
            </header>

            {/* --- CONTENIDO PRINCIPAL DEL CARRITO --- */}
            <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 mt-4">
                <header className="mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-8 hover:opacity-50 transition-opacity text-gray-500">
                        <ArrowLeft size={14} /> Volver al Protocolo
                    </Link>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">Orden de Adquisición</h1>
                    <p className="text-gray-400 font-mono text-[10px] uppercase tracking-[0.2em] mt-2">Salida de Mercancía</p>
                </header>

                {(!carrito || carrito.length === 0) ? (
                    <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl">
                        <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">No hay unidades asignadas al archivo</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* --- INYECTAMOS LA BARRA DE ENVÍO GRATIS AQUÍ --- */}
                        <BarraEnvioGratisCarrito />
                        {/* ------------------------------------------------ */}

                        {carrito.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="bg-white border border-gray-100 p-6 rounded-3xl flex flex-col md:flex-row gap-6 items-center shadow-sm">
                                <img src={item.img} alt={item.name} className="w-24 h-32 object-cover rounded-xl bg-gray-50" />
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="font-black uppercase tracking-tighter text-lg">{item.name}</h3>
                                    <p className="text-gray-400 text-[10px] uppercase font-mono mt-1">ID: {String(item.shopifyId || item.id).substring(0, 15)}...</p>

                                    <div className="flex items-center justify-center md:justify-start gap-3 mt-4 bg-white w-fit rounded-full p-1 border border-gray-100 mx-auto md:mx-0 shadow-sm">
                                        <button onClick={() => actualizarCantidad(index, -1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-50 font-bold">-</button>
                                        <span className="text-[10px] font-black w-4 text-center">{item.cantidad || 1}</span>
                                        <button onClick={() => actualizarCantidad(index, 1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-50 font-bold">+</button>
                                    </div>
                                </div>
                                <div className="text-center md:text-right flex flex-col items-center md:items-end gap-4">
                                    <p className="font-black text-sm">{item.price || item.precio}</p>
                                    <button onClick={() => eliminarPrenda(index)} className="p-2 text-gray-300 hover:text-red-500 transition-colors shadow-sm bg-white rounded-full">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <footer className="mt-12 bg-black text-white p-8 rounded-[40px] shadow-2xl">
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-1">Total del Archivo</p>
                                    <h2 className="text-4xl font-black italic tracking-tighter">
                                        ${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                                    </h2>
                                </div>
                                <div className="hidden md:block text-right">
                                    <p className="text-[10px] text-zinc-500 uppercase font-mono">
                                        {subtotal >= 1050 ? "¡Envío Gratis Aplicado! 🎉" : "Envío calculado en checkout"}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={cargando}
                                className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all disabled:opacity-50 shadow-lg"
                            >
                                {cargando ? "Sincronizando con la Bóveda..." : (
                                    <> <CreditCard size={18} /> Proceder a pagar... </>
                                )}
                            </button>
                        </footer>
                    </div>
                )}
            </main>
        </div>
    );
}