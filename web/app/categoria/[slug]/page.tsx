"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductsByCollection } from '../../lib/shopify';
import { useCartStore } from '../../store/useCartStore';
import { ArrowLeft, ShoppingBag, Heart, Search, LayoutGrid, Bell, User } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CategoriaPage() {
    const { slug } = useParams();
    const [productos, setProductos] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);

    // FIX: Extraemos con seguridad los arrays para evitar el error rojo
    const { carrito = [], favoritos = [], toggleFavorito, agregarPrenda } = useCartStore();
    const [isLoggedIn] = useState(false);
    const userName = "Osva";

    // Matemáticas blindadas para los globitos
    const cantidadTotalCarrito = carrito?.reduce((total, item) => total + (item.cantidad || 1), 0) || 0;
    const cantidadTotalCloset = favoritos?.length || 0;

    // FIX MÁGICO: Limpiamos los guiones para que el título se vea estético
    const tituloFormateado = typeof slug === 'string' ? slug.replace(/-/g, ' ') : '';

    useEffect(() => {
        async function fetchCategoria() {
            try {
                const data = await getProductsByCollection(slug as string);
                const formateados = data.map((item: any) => ({
                    id: item.node.id,
                    handle: item.node.handle,
                    shopifyId: item.node.variants?.edges?.[0]?.node?.id || "ID_VACIO",
                    name: item.node.title,
                    price: `$${parseFloat(item.node.priceRange.minVariantPrice.amount).toLocaleString()} MXN`,
                    img: item.node.images.edges?.[0]?.node?.url || 'https://via.placeholder.com/600',
                }));
                setProductos(formateados);
            } catch (error) {
                console.error("Error al cargar la categoría:", error);
            } finally {
                setCargando(false);
            }
        }
        fetchCategoria();
    }, [slug]);

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-black font-sans flex flex-col selection:bg-black selection:text-white">

            {/* --- EL NUEVO NAVBAR (PÍLDORA NEGRA) --- */}
            <header className="bg-white/80 backdrop-blur-md text-black px-4 py-4 sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
                    {/* LOGO */}
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

                    {/* PÍLDORA NEGRA CON TODOS LOS BOTONES */}
                    <div className="flex items-center space-x-5 md:space-x-8 text-[10px] font-black uppercase tracking-widest bg-black text-white px-6 py-3 rounded-full shadow-xl">

                        <Link href="/closet" className="flex items-center gap-2 relative hover:text-gray-300 transition-colors">
                            <LayoutGrid size={16} />
                            <span className="hidden lg:inline">Closet</span>
                            {cantidadTotalCloset > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-black shadow-sm">
                                    {cantidadTotalCloset}
                                </span>
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

                        <div className="w-[1px] h-4 bg-zinc-700 hidden lg:block"></div>

                        <Link href="/carrito" className="flex items-center gap-2 relative hover:text-gray-300 transition-colors">
                            <ShoppingBag size={16} />
                            <span className="hidden lg:inline">Carrito</span>
                            {cantidadTotalCarrito > 0 && (
                                <span className="absolute -top-2 -right-3 bg-white text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-black shadow-sm">
                                    {cantidadTotalCarrito}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </header>

            {/* --- CONTENIDO DE CATEGORÍAS --- */}
            <div className="max-w-7xl mx-auto p-4 md:p-12 w-full">
                <header className="mb-12 md:mb-16">
                    <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] mb-8 hover:opacity-50 transition-opacity text-gray-500">
                        <ArrowLeft size={14} /> Volver al Protocolo
                    </Link>
                    <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none break-words">
                        {/* FIX: Aquí usamos la variable limpia */}
                        Archivo: <span className="text-gray-400">{tituloFormateado}</span>
                    </h1>
                </header>

                {cargando ? (
                    <div className="flex items-center justify-center py-20 font-mono text-xs uppercase tracking-[0.5em] animate-pulse">Sincronizando Arsenal...</div>
                ) : productos.length === 0 ? (
                    /* FIX: Mensaje elegante por si la colección no tiene ropa todavía */
                    <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl">
                        <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Aún no hay unidades en este sector del archivo</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
                        {productos.map((prod, i) => {
                            const esFavorito = (favoritos || []).some((fav: any) => fav.id === prod.id);

                            return (
                                <motion.div key={prod.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group relative flex flex-col cursor-pointer">
                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorito(prod); }} className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full hover:scale-110 transition-transform shadow-sm">
                                        <Heart size={16} className={esFavorito ? "fill-red-500 text-red-500" : "text-gray-400"} />
                                    </button>

                                    <div className="aspect-[4/5] bg-[#f8f8f8] rounded-2xl md:rounded-3xl overflow-hidden relative mb-4 shadow-sm">
                                        <Link href={`/products/${prod.handle}`} className="block w-full h-full">
                                            <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                                        </Link>
                                        <div className="absolute bottom-0 w-full p-4 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 pointer-events-none md:pointer-events-auto">
                                            <Link href={`/products/${prod.handle}`} className="pointer-events-auto">
                                                <div className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest text-[9px] text-center shadow-xl">
                                                    Selecciona tu talla
                                                </div>
                                            </Link>
                                        </div>
                                    </div>

                                    <Link href={`/products/${prod.handle}`}>
                                        <h3 className="font-bold uppercase tracking-widest text-xs mb-1 truncate hover:text-gray-500 transition-colors">{prod.name}</h3>
                                        <p className="text-gray-400 font-mono text-[10px]">{prod.price}</p>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}