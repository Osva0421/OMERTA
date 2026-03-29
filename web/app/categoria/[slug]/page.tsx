"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProducts } from '../../lib/shopify';
import { useCartStore } from '../../store/useCartStore';
import { ArrowLeft, ShoppingBag, Search, LayoutGrid, Bell, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProductCardInteractiva } from '../../../components/ProductCardInteractiva';

// Función para crear el slug (debe ser igual a la de la Home)
const crearSlug = (texto: string) => {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
};

export default function CategoriaPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [productos, setProductos] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);

    const { carrito = [], favoritos = [], toggleFavorito } = useCartStore();
    const [isLoggedIn] = useState(false);
    const userName = "Osva";

    const cantidadTotalCarrito = carrito?.reduce((total, item) => total + (item.cantidad || 1), 0) || 0;
    const cantidadTotalCloset = favoritos?.length || 0;

    const tituloFormateado = typeof slug === 'string' ? slug.replace(/-/g, ' ') : '';

    // Determinamos el género basado en el slug para mostrar la barra correcta
    const esWoman = (slug as string).toLowerCase().includes('woman');
    const generoActual = esWoman ? 'WOMAN' : 'MEN';

    const subCategorias = esWoman
        ? ["Baby Tees", "Oversize", "Hoodies", "Blusas", "Accesorios"]
        : ["Playeras", "Oversize", "Hoodies", "Pantalones", "Accesorios"];

    useEffect(() => {
        async function fetchCategoria() {
            try {
                const data = await getProducts();
                const slugLimpio = (slug as string).toLowerCase();

                const filtradosPorTag = data.filter((item: any) => {
                    const tagsDelProducto = (item.node.tags || []).map((t: string) => t.toLowerCase());
                    if (tagsDelProducto.includes(slugLimpio)) return true;
                    const partesDelSlug = slugLimpio.split('-');
                    return tagsDelProducto.some((tag: string) =>
                        partesDelSlug.every((parte: string) => tag.includes(parte))
                    );
                });

                const formateados = filtradosPorTag.map((item: any) => ({
                    id: item.node.id,
                    handle: item.node.handle,
                    shopifyId: item.node.variants?.edges?.[0]?.node?.id || "ID_VACIO",
                    name: item.node.title,
                    price: `$${parseFloat(item.node.priceRange.minVariantPrice.amount).toLocaleString()} MXN`,
                    img: item.node.images.edges?.[0]?.node?.url || 'https://via.placeholder.com/600',
                    galeria: item.node.images.edges.map((e: any) => e.node.url),
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

            {/* --- HEADER --- */}
            <header className="bg-white/80 backdrop-blur-md text-black px-4 py-4 sticky top-0 z-[100] border-b border-gray-100">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
                    <Link href="/" className="flex-shrink-0">
                        <img src="/monograma-omerta.png" alt="OMERTA" className="h-10 md:h-12 w-auto hover:scale-105 transition-transform" />
                    </Link>

                    <div className="flex-1 max-w-xl mx-auto hidden md:block">
                        <div className="flex items-center bg-white rounded-full px-5 py-2.5 border border-gray-200 shadow-inner focus-within:border-black transition-colors">
                            <Search size={16} className="text-gray-400 mr-3" />
                            <input type="text" placeholder="Buscar en el archivo..." className="w-full bg-transparent outline-none text-xs font-medium" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-5 md:space-x-8 text-[10px] font-black uppercase tracking-widest bg-black text-white px-6 py-3 rounded-full shadow-xl">
                        <Link href="/closet" className="flex items-center gap-2 relative">
                            <LayoutGrid size={16} />
                            <span className="hidden lg:inline">Closet</span>
                            {cantidadTotalCloset > 0 && <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-black">{cantidadTotalCloset}</span>}
                        </Link>
                        <button className="flex items-center gap-2"><Bell size={16} /></button>
                        <Link href="/login" className="flex items-center gap-2"><User size={16} /><span className="hidden lg:inline">{isLoggedIn ? userName : 'Entrar'}</span></Link>
                        <div className="w-[1px] h-4 bg-zinc-700 hidden lg:block"></div>
                        <Link href="/carrito" className="flex items-center gap-2 relative">
                            <ShoppingBag size={16} />
                            <span className="hidden lg:inline">Bolsa</span>
                            {cantidadTotalCarrito > 0 && <span className="absolute -top-2 -right-3 bg-white text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-black">{cantidadTotalCarrito}</span>}
                        </Link>
                    </div>
                </div>
            </header>

            {/* --- NUEVA NAVEGACIÓN ULTRA COMPACTA (DEBAJO DEL HEADER) --- */}
            <nav className="w-full py-4 bg-white border-b border-gray-100 sticky top-[73px] z-[80] backdrop-blur-md bg-white/95">
                <div className="flex flex-nowrap justify-center gap-3 md:gap-10 no-scrollbar px-2 w-full overflow-x-auto">
                    {subCategorias.map((sub) => (
                        <Link
                            key={sub}
                            href={`/categoria/${crearSlug(generoActual + '-' + sub)}`}
                            className={`text-[8px] md:text-xs font-black uppercase tracking-widest md:tracking-[0.3em] transition-colors whitespace-nowrap flex-shrink-0 ${(slug as string).toLowerCase().includes(crearSlug(sub))
                                ? 'text-black underline underline-offset-4'
                                : 'text-gray-400 hover:text-black'
                                }`}
                        >
                            {sub}
                        </Link>
                    ))}
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-4 md:p-12 w-full">
                <header className="mb-12 md:mb-16">
                    <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] mb-8 hover:opacity-50 transition-opacity text-gray-500">
                        <ArrowLeft size={14} /> Volver al Protocolo
                    </button>
                    <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none break-words">
                        Archivo: <span className="text-gray-400">{tituloFormateado}</span>
                    </h1>
                </header>

                {cargando ? (
                    <div className="flex items-center justify-center py-20 font-mono text-xs uppercase tracking-[0.5em] animate-pulse">Sincronizando Arsenal...</div>
                ) : productos.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl">
                        <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Aún no hay unidades en este sector del archivo</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
                        {productos.map((prod) => {
                            const esFavorito = (favoritos || []).some((fav: any) => fav.id === prod.id);
                            return (
                                <ProductCardInteractiva
                                    key={prod.id}
                                    prod={prod}
                                    esFavorito={esFavorito}
                                    toggleFavorito={toggleFavorito}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}