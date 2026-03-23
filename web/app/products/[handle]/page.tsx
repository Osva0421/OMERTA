"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProduct, getProducts } from '../../lib/shopify';
import { useCartStore } from '../../store/useCartStore';
import { ArrowLeft, ShoppingBag, Heart, Search, LayoutGrid, Bell, User, ChevronRight, Truck, ShieldCheck, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

function DescripcionTecnica({ texto }: { texto: string }) {
    const [estaExpandida, setEstaExpandida] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return <div className="animate-pulse bg-gray-100 h-24 rounded-xl mb-8"></div>;

    const textoTruncado = texto.substring(0, 150) + "...";
    const necesitaTruncado = texto.length > 150;

    return (
        <div className="mb-8 mt-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-gray-400 border-t border-gray-100 pt-6">Descripción Técnica</h3>
            <p className="text-sm leading-relaxed text-gray-700">
                {estaExpandida || !necesitaTruncado ? texto : textoTruncado}
            </p>
            {necesitaTruncado && (
                <button
                    onClick={() => setEstaExpandida(!estaExpandida)}
                    className="mt-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                    {estaExpandida ? "Leer menos" : "Leer más"}
                </button>
            )}
        </div>
    );
}

// --- COMPONENTE CORREGIDO: BARRA DE PROGRESO EN VIVO ---
function BarraEnvioGratis() {
    // FIX: Escuchamos los cambios del carrito para actualizar en vivo
    const carrito = useCartStore((state) => state.carrito);
    const obtenerTotalCarrito = useCartStore((state) => state.obtenerTotalCarrito);

    const total = obtenerTotalCarrito();
    const META_ENVIO = 1050;
    const falta = Math.max(0, META_ENVIO - total);
    const porcentaje = Math.min((total / META_ENVIO) * 100, 100);

    return (
        <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
            <div className="flex justify-between items-end mb-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-black">
                    {total >= META_ENVIO ? "¡ENVÍO GRATIS DESBLOQUEADO! 🚚" : "ENVÍO GRATIS 📦"}
                </p>
                {total < META_ENVIO && (
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

            {total > 0 && total < META_ENVIO && (
                <p className="text-[9px] text-gray-400 mt-3 text-center uppercase tracking-widest">
                    Agrega este u otros productos para no pagar envío.
                </p>
            )}
        </div>
    );
}
// --------------------------------------------------------

export default function ProductPage() {
    const { handle } = useParams();
    const router = useRouter();

    const [producto, setProducto] = useState<any>(null);
    const [cargando, setCargando] = useState(true);
    const [varianteSeleccionada, setVarianteSeleccionada] = useState<any>(null);
    const [imagenActiva, setImagenActiva] = useState<string>('');

    // Estados del Buscador y Catálogo Global
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [todosLosProductos, setTodosLosProductos] = useState<any[]>([]);
    const [mostrandoResultados, setMostrandoResultados] = useState(false);

    const [fechaEntrega, setFechaEntrega] = useState('');

    // --- NUEVOS ESTADOS PARA ANIMACIONES ---
    const [corazonVolador, setCorazonVolador] = useState(false);
    const [bolsaVoladora, setBolsaVoladora] = useState(false);

    const { agregarPrenda, favoritos = [], carrito = [], toggleFavorito } = useCartStore();
    const [isLoggedIn] = useState(false);
    const userName = "Osva";

    const cantidadTotalCarrito = carrito?.reduce((total, item) => total + (item.cantidad || 1), 0) || 0;
    const cantidadTotalCloset = favoritos?.length || 0;

    useEffect(() => {
        async function fetchProducto() {
            const data = await getProduct(handle as string);
            if (data) {
                setProducto(data);
                setVarianteSeleccionada(data.variants.edges[0].node);
                if (data.images.edges.length > 0) {
                    setImagenActiva(data.images.edges[0].node.url);
                }
            }
            setCargando(false);
        }
        fetchProducto();
    }, [handle]);

    useEffect(() => {
        async function cargarCatalogoBuscador() {
            const data = await getProducts();
            const formateados = data.map((item: any) => ({
                handle: item.node.handle,
                name: item.node.title,
                price: `$${parseFloat(item.node.priceRange.minVariantPrice.amount).toLocaleString()} MXN`,
                img: item.node.images.edges?.[0]?.node?.url,
                tags: item.node.tags || [],
            }));
            setTodosLosProductos(formateados);
        }
        cargarCatalogoBuscador();

        const hoy = new Date();
        const min = new Date(hoy); min.setDate(hoy.getDate() + 3);
        const max = new Date(hoy); max.setDate(hoy.getDate() + 6);
        const opciones = { day: 'numeric', month: 'short' } as const;
        setFechaEntrega(`${min.toLocaleDateString('es-MX', opciones)} al ${max.toLocaleDateString('es-MX', opciones)}`);
    }, []);

    const ejecutarBusqueda = (e: React.FormEvent) => {
        e.preventDefault();
        if (terminoBusqueda.trim()) {
            router.push(`/buscar?q=${encodeURIComponent(terminoBusqueda)}`);
        }
    };

    const resultadosBusqueda = terminoBusqueda.trim() === ''
        ? []
        : todosLosProductos.filter(p => p.name.toLowerCase().includes(terminoBusqueda.toLowerCase()));

    // --- LÓGICA DE RECOMENDADOS INTELIGENTE POR GÉNERO ---
    const productoActualEnCatalogo = todosLosProductos.find(p => p.handle === handle);
    const esPrendaMujer = productoActualEnCatalogo?.tags?.some((tag: string) => tag.toLowerCase().startsWith('woman-')) || false;
    const prefijoGenero = esPrendaMujer ? 'woman-' : 'men-';

    const productosRecomendados = todosLosProductos
        .filter(p => p.handle !== handle)
        .filter(p => p.tags?.some((tag: string) => tag.toLowerCase().startsWith(prefijoGenero)))
        .slice(0, 4);

    if (cargando) return <div className="min-h-screen flex items-center justify-center font-mono text-xs uppercase tracking-[0.5em] animate-pulse text-black">Desencriptando datos...</div>;
    if (!producto) return <div className="min-h-screen flex items-center justify-center font-black text-4xl uppercase">Archivo no encontrado</div>;

    const precioBase = producto.priceRange.minVariantPrice.amount;
    const precioActual = varianteSeleccionada?.price?.amount || precioBase;
    const precioFormateado = `$${parseFloat(precioActual).toLocaleString()} MXN`;

    const prendaActual = {
        id: producto.id,
        shopifyId: varianteSeleccionada?.id,
        name: `${producto.title} (${varianteSeleccionada?.title.split(' / ').pop()})`,
        price: precioFormateado,
        rawPrice: parseFloat(precioActual),
        img: producto.images.edges[0]?.node.url
    };

    // FIX: Determinamos si la variante actual está en favoritos
    // (Verificamos por shopifyId para que sea exacto por talla)
    const esFavorito = favoritos.some((fav) => fav.shopifyId === varianteSeleccionada?.id);

    // --- MANEJADORES DE CLIC CON ANIMACIÓN ---
    const manejarFavorito = () => {
        // Solo vuela el corazón si lo estamos agregando
        if (!esFavorito) {
            setCorazonVolador(true);
            setTimeout(() => setCorazonVolador(false), 800);
        }
        toggleFavorito(prendaActual);
    };

    const manejarCarrito = () => {
        setBolsaVoladora(true);
        setTimeout(() => setBolsaVoladora(false), 800);
        agregarPrenda(prendaActual);
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans flex flex-col selection:bg-black selection:text-white pb-24 relative overflow-x-hidden">

            {/* --- NAVBAR --- */}
            <header className="bg-white/90 backdrop-blur-md text-black px-4 py-4 sticky top-0 z-50 border-b border-gray-100 relative">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-4 gap-x-3">

                    <Link href="/" className="flex-shrink-0">
                        <img src="/monograma-omerta.png" alt="OMERTA" className="h-10 md:h-12 w-auto hover:scale-105 transition-transform" />
                    </Link>

                    <div className="w-full order-last lg:order-none lg:flex-1 lg:max-w-xl mx-auto relative z-50">
                        <form onSubmit={ejecutarBusqueda} className="flex items-center bg-white rounded-full px-5 py-3 md:py-2.5 border border-gray-200 shadow-sm focus-within:border-black focus-within:ring-2 focus-within:ring-black/5 transition-all">
                            <button type="submit"><Search size={16} className="text-gray-400 mr-3 hover:text-black transition-colors" /></button>
                            <input
                                type="text"
                                value={terminoBusqueda}
                                onChange={(e) => {
                                    setTerminoBusqueda(e.target.value);
                                    setMostrandoResultados(true);
                                }}
                                onFocus={() => setMostrandoResultados(true)}
                                onBlur={() => setTimeout(() => setMostrandoResultados(false), 200)}
                                placeholder="Buscar en el archivo (Ej. Playera)..."
                                className="w-full bg-transparent outline-none text-xs font-bold tracking-wide"
                            />
                        </form>

                        <AnimatePresence>
                            {mostrandoResultados && terminoBusqueda.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden z-[100] max-h-[60vh] overflow-y-auto"
                                >
                                    {resultadosBusqueda.length > 0 ? (
                                        <div className="p-2">
                                            {resultadosBusqueda.map(prod => (
                                                <Link
                                                    key={prod.handle}
                                                    href={`/products/${prod.handle}`}
                                                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors group"
                                                >
                                                    <div className="w-14 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                                        <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-xs font-black uppercase tracking-widest truncate group-hover:text-gray-600 transition-colors">{prod.name}</h4>
                                                    </div>
                                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-black transition-colors mr-2" />
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-10 text-center flex flex-col items-center justify-center">
                                            <Search size={32} className="text-gray-200 mb-4" />
                                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                                Sin coincidencias en el archivo
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center space-x-4 md:space-x-8 text-[10px] font-black uppercase tracking-widest bg-black text-white px-5 py-3 md:px-6 rounded-full shadow-xl">
                        <Link href="/closet" className="flex items-center gap-2 relative hover:text-gray-300 transition-colors">
                            <LayoutGrid size={16} />
                            <span className="hidden lg:inline">Closet</span>
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

                        <div className="w-[1px] h-4 bg-zinc-700 hidden lg:block"></div>

                        <Link href="/carrito" className="flex items-center gap-2 relative hover:text-gray-300 transition-colors">
                            <ShoppingBag size={16} />
                            <span className="hidden lg:inline">Carrito</span>
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

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12 relative z-10">

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

                    {/* --- IZQUIERDA: GALERÍA DE FOTOS --- */}
                    <div className="w-full lg:w-[60%] flex flex-col-reverse lg:flex-row gap-4">

                        {/* Miniaturas */}
                        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto snap-x snap-mandatory no-scrollbar lg:w-28 flex-none pb-2 lg:pb-0">
                            {producto.images.edges.map((img: any, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setImagenActiva(img.node.url)}
                                    className={`relative aspect-[4/5] flex-none w-20 lg:w-full snap-center rounded-xl overflow-hidden transition-all duration-300 ${imagenActiva === img.node.url
                                        ? 'opacity-100 ring-2 ring-black shadow-lg'
                                        : 'opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <img
                                        src={img.node.url}
                                        alt={`${producto.title} vista ${i + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* IMAGEN PRINCIPAL (FIX REAL) */}
                        <div className="flex-1 relative flex items-start justify-center">
                            <img
                                src={imagenActiva || producto.images.edges[0]?.node.url}
                                alt={producto.title}
                                className="w-full h-auto object-contain transition-all duration-500"
                            />
                            <div className="absolute top-6 left-6 bg-black/10 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold text-black uppercase tracking-widest">
                                Vigilancia Omerta
                            </div>
                        </div>
                    </div>

                    {/* --- DERECHA: DATOS DEL PRODUCTO --- */}
                    <div className="w-full lg:w-[40%] flex flex-col lg:sticky lg:top-32 h-fit">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] mb-4">{producto.title}</h1>
                        <p className="text-xl md:text-2xl font-mono text-gray-500 mb-8 transition-all">{precioFormateado}</p>

                        <div className="mb-8">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-gray-400">Selecciona tu talla</h3>
                            <div className="flex flex-wrap gap-3 pb-4">
                                {producto.variants.edges.map(({ node }: any) => {
                                    const labelTalla = node.title.split(' / ').pop();
                                    return (
                                        <button
                                            key={node.id}
                                            onClick={() => setVarianteSeleccionada(node)}
                                            disabled={!node.availableForSale}
                                            className={`px-6 py-4 border-2 font-black uppercase tracking-widest text-xs min-w-[70px] transition-all rounded-xl ${varianteSeleccionada?.id === node.id
                                                ? 'border-black bg-black text-white scale-105 shadow-md'
                                                : 'border-gray-100 text-gray-400 hover:border-black'
                                                } ${!node.availableForSale ? 'opacity-30 line-through cursor-not-allowed' : ''}`}
                                        >
                                            {labelTalla}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <BarraEnvioGratis />

                        <div className="flex gap-3 mb-8">
                            <button
                                onClick={manejarCarrito}
                                className="flex-1 bg-black text-white py-5 text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all rounded-2xl shadow-xl flex items-center justify-center gap-3 relative"
                            >
                                <ShoppingBag size={18} /> AGREGAR AL CARRITO

                                <AnimatePresence>
                                    {bolsaVoladora && (
                                        <motion.div
                                            initial={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                                            animate={{ opacity: 0, y: -120, scale: 1.5, x: 40 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                            className="absolute pointer-events-none z-50"
                                        >
                                            <ShoppingBag size={24} className="text-white fill-black" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>

                            {/* FIX: Ahora esFavorito controla el color del corazón dinámicamente */}
                            <button
                                onClick={manejarFavorito}
                                className={`w-16 md:w-20 rounded-2xl flex items-center justify-center border-2 transition-all shadow-md relative ${esFavorito ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-100 text-gray-300 hover:border-gray-300'}`}
                            >
                                <Heart size={24} className={esFavorito ? "fill-red-500" : ""} />

                                <AnimatePresence>
                                    {corazonVolador && (
                                        <motion.div
                                            initial={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                                            animate={{ opacity: 0, y: -120, scale: 1.5, x: 40 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                            className="absolute pointer-events-none z-50"
                                        >
                                            <Heart size={24} className="fill-red-500 text-red-500" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>

                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 space-y-5 mb-8">
                            <div className="flex items-start gap-4">
                                <Truck size={20} className="text-black mt-1" />
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-black mb-1">Envío a todo México</h4>
                                    <p className="text-xs text-gray-500">Llegada estimada: <span className="font-bold text-black">{fechaEntrega || 'Calculando...'}</span></p>
                                </div>
                            </div>
                            <div className="w-full h-px bg-gray-200"></div>
                            <div className="flex items-start gap-4">
                                <ShieldCheck size={20} className="text-black mt-1" />
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-black mb-1">Pago 100% Seguro</h4>
                                    <p className="text-xs text-gray-500">Transacción encriptada por Mercado Pago Checkout Pro.</p>
                                </div>
                            </div>
                            <div className="w-full h-px bg-gray-200"></div>
                            <div className="flex items-start gap-4">
                                <RefreshCcw size={20} className="text-black mt-1" />
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-black mb-1">Garantía del Archivo</h4>
                                    <p className="text-xs text-gray-500">Cambios y devoluciones disponibles. Revisa el protocolo en el footer.</p>
                                </div>
                            </div>
                        </div>

                        <DescripcionTecnica texto={producto.description} />
                    </div>
                </div>

                {/* --- SECCIÓN: COMPLETA TU UNIFORME --- */}
                {productosRecomendados.length > 0 && (
                    <section className="mt-24 pt-16 border-t border-gray-100">
                        <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-10 text-black">
                            COMBINA TU ROPA OUTFIT
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                            {productosRecomendados.map((prod) => (
                                <div key={prod.handle} className="group relative flex flex-col cursor-pointer">
                                    <div className="aspect-[4/5] bg-[#f8f8f8] mb-4 relative overflow-hidden rounded-2xl">
                                        <Link href={`/products/${prod.handle}`} className="block w-full h-full">
                                            <img
                                                src={prod.img}
                                                alt={prod.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </Link>
                                    </div>
                                    <Link href={`/products/${prod.handle}`}>
                                        <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-widest truncate group-hover:text-gray-500 transition-colors">
                                            {prod.name}
                                        </h4>
                                        <p className="text-gray-400 text-xs mt-1">{prod.price}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}