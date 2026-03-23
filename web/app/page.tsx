"use client";

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, User, LayoutGrid, Bell, ChevronRight, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';
import Typewriter from 'typewriter-effect';
import { useRouter } from 'next/navigation';

// --- IMPORTAMOS EL CEREBRO GLOBAL Y SHOPIFY ---
import { useCartStore } from './store/useCartStore';
import { getProducts } from './lib/shopify';

// --- IMPORTACIONES 3D ---
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Html } from '@react-three/drei';

function PantallaCarga() {
  return <Html center><div className="text-black text-xs font-mono tracking-widest bg-white/80 px-4 py-2 rounded">CARGANDO...</div></Html>;
}

function Playera3D() {
  const { scene } = useGLTF('/playera.glb');
  return (
    <Center>
      <primitive object={scene} scale={5.5} />
    </Center>
  );
}

function ControlesCamara() {
  return (
    <OrbitControls enableZoom={false} minDistance={2} maxDistance={6} enablePan={false} autoRotate autoRotateSpeed={1.5} />
  );
}

const crearSlug = (texto: string) => {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
};

export default function InicioOMERTA() {
  const router = useRouter();
  const { carrito = [], favoritos = [], toggleFavorito } = useCartStore();
  const [genero, setGenero] = useState<'MEN' | 'WOMAN'>('MEN');
  const [isLoggedIn] = useState(false);
  const userName = "Osva";

  const [productosShopify, setProductosShopify] = useState<any[]>([]);
  const [cargandoShopify, setCargandoShopify] = useState(true);

  // --- ESTADOS PARA EL BUSCADOR EN VIVO ---
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [mostrandoResultados, setMostrandoResultados] = useState(false);

  useEffect(() => {
    async function extraerArsenal() {
      try {
        const data = await getProducts();
        const formateados = data.map((item: any) => ({
          id: item.node.id,
          handle: item.node.handle,
          shopifyId: item.node.variants?.edges?.[0]?.node?.id || "ID_VACIO",
          name: item.node.title,
          price: `$${parseFloat(item.node.priceRange.minVariantPrice.amount).toLocaleString()} MXN`,
          rawPrice: parseFloat(item.node.priceRange.minVariantPrice.amount),
          img: item.node.images.edges?.[0]?.node?.url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800',
          tags: item.node.tags || [],
        }));
        setProductosShopify(formateados);
      } catch (error) {
        console.error("Error al sincronizar con Shopify:", error);
      } finally {
        setCargandoShopify(false);
      }
    }
    extraerArsenal();
  }, []);

  // --- CÁLCULOS PARA EL ENVÍO GRATIS ---
  const cantidadTotalCarrito = carrito?.reduce((total, item) => total + (item.cantidad || 1), 0) || 0;
  const cantidadTotalCloset = favoritos?.reduce((total, item) => total + (item.cantidad || 1), 0) || 0;

  const totalDineroCarrito = carrito?.reduce((total, item) => total + (item.rawPrice * (item.cantidad || 1) || 0), 0) || 0;
  const META_ENVIO_GRATIS = 1050;
  const faltaParaEnvio = META_ENVIO_GRATIS - totalDineroCarrito;

  // --- EL MOTOR DE FILTRADO EN VIVO ---
  const productosFiltrados = productosShopify.filter((prod) => {
    const prefijo = genero === 'MEN' ? 'men-' : 'woman-';
    return prod.tags.some((tag: string) => tag.toLowerCase().startsWith(prefijo));
  });

  // --- LÓGICA DEL BUSCADOR EN VIVO ---
  const resultadosBusqueda = terminoBusqueda.trim() === ''
    ? []
    : productosShopify.filter(p => p.name.toLowerCase().includes(terminoBusqueda.toLowerCase()));

  const ejecutarBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    if (terminoBusqueda.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(terminoBusqueda)}`);
    }
  };

  const config = {
    MEN: {
      bgColor: '#ffffff',
      textColor: '#111111',
      frase: "LA BASE DE TU UNIFORME URBANO. CONSTRUIDO PARA RESISTIR.",
      subCategorias: ["Playeras", "Oversize", "Hoodies", "Pantalones", "Accesorios"],
      lookbook: [
        { title: 'Archive Essentials', desc: 'La base de tu clóset.', img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800' },
        { title: 'Heavyweight Hoodies', desc: 'Algodón premium 400g.', img: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=800' },
        { title: 'Pantalones Utilitarios', desc: 'Cortes tácticos de ciudad.', img: 'https://images.unsplash.com/photo-1523398002811-999aa8a7340e?q=80&w=800' }
      ]
    },
    WOMAN: {
      bgColor: '#E5DFD3',
      textColor: '#1a1a1a',
      frase: "ESTRUCTURA Y MOVIMIENTO. REDEFINIENDO LA SILUETA.",
      subCategorias: ["Baby Tees", "Oversize", "Hoodies", "Leggings", "Accesorios"],
      lookbook: [
        { title: 'Archive Essentials', desc: 'Ajuste arquitectónico.', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800' },
        { title: 'Oversize Femenino', desc: 'Estilo sin esfuerzo.', img: 'https://images.unsplash.com/photo-1434389670869-bac08d471df4?q=80&w=800' },
        { title: 'Pantalones Cargo', desc: 'Cintura alta, caída pesada.', img: 'https://images.unsplash.com/photo-1583496920966-2679589d9c22?q=80&w=800' }
      ]
    }
  };

  const actual = config[genero];

  return (
    <motion.div
      className="min-h-screen transition-colors duration-700 ease-in-out selection:bg-black selection:text-white font-sans"
      animate={{ backgroundColor: actual.bgColor, color: actual.textColor }}
    >

      {/* --- NUEVO CONTENEDOR FIJO (HEADER + BANNER) --- */}
      <div className="sticky top-0 z-50 w-full flex flex-col">

        {/* EL NAVBAR (Ahora arriba) */}
        <header className="bg-white/80 backdrop-blur-md text-black px-4 py-4 border-b border-gray-100 relative">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-4 gap-x-3">

            <Link href="/" className="flex-shrink-0">
              <img src="/monograma-omerta.png" alt="OMERTA" className="h-10 md:h-12 w-auto hover:scale-105 transition-transform" />
            </Link>

            {/* BUSCADOR EN VIVO */}
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

              {/* CAJA FLOTANTE DE RESULTADOS */}
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

        {/* ANNOUNCEMENT BAR DINÁMICA (Ahora debajo del Navbar) */}
        <div className="bg-black text-white py-2 px-4 text-center text-[10px] md:text-xs font-black uppercase tracking-widest shadow-md">
          <AnimatePresence mode="wait">
            <motion.span
              key={totalDineroCarrito >= META_ENVIO_GRATIS ? 'gratis' : 'falta'}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3 }}
            >
              {totalDineroCarrito === 0
                ? `ENVÍO GRATIS EN COMPRAS MAYORES A $${META_ENVIO_GRATIS.toLocaleString()} MXN 📦`
                : totalDineroCarrito >= META_ENVIO_GRATIS
                  ? "¡FELICIDADES! HAS DESBLOQUEADO EL ENVÍO GRATIS 🚚"
                  : `FALTAN $${faltaParaEnvio.toLocaleString()} MXN PARA OBTENER ENVÍO GRATIS 📦`}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      {/* --- FIN DEL CONTENEDOR FIJO --- */}


      {/* --- NAVEGACIÓN --- */}
      <nav className="w-full pt-10 flex flex-col items-center gap-8 relative z-10">
        <div className="bg-white/30 backdrop-blur-sm p-1 rounded-full flex border border-gray-300 shadow-inner">
          <button onClick={() => setGenero('MEN')} className={`px-12 py-3 rounded-full text-xs font-bold tracking-widest transition-all ${genero === 'MEN' ? 'bg-black text-white shadow-lg' : 'text-gray-400'}`}>OMERTA MEN</button>
          <button onClick={() => setGenero('WOMAN')} className={`px-12 py-3 rounded-full text-xs font-bold tracking-widest transition-all ${genero === 'WOMAN' ? 'bg-[#A89F91] text-white shadow-lg' : 'text-gray-400'}`}>OMERTA WOMAN</button>
        </div>
        <div className="w-full max-w-4xl px-4 border-b border-gray-200/50">
          <div className="flex overflow-x-auto justify-center gap-10 pb-4 no-scrollbar">
            {actual.subCategorias.map((sub) => (
              <Link key={sub + genero} href={`/categoria/${crearSlug(genero + '-' + sub)}`} className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors whitespace-nowrap">
                {sub}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* --- MAIN HERO --- */}
      <main className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between min-h-[55vh] gap-8 relative z-10">
        <div className="w-full md:w-1/2 text-center md:text-left h-40 flex items-center">
          <h2 className="text-3xl md:text-6xl font-black tracking-tighter leading-[1.1] uppercase">
            <AnimatePresence mode="wait">
              <motion.span key={genero} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Typewriter key={genero} onInit={(t) => t.typeString(actual.frase).start()} options={{ delay: 45, cursor: '|', wrapperClassName: "text-black" }} />
              </motion.span>
            </AnimatePresence>
          </h2>
        </div>
        <div className="w-full md:w-1/2 h-[50vh] flex justify-center">
          <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
            <ambientLight intensity={2.5} /><spotLight position={[10, 10, 10]} intensity={3} /><ControlesCamara />
            <Suspense fallback={<PantallaCarga />}><group key={genero}><Playera3D /></group></Suspense>
          </Canvas>
        </div>
      </main>

      {/* --- SECCIÓN LOOKBOOK --- */}
      <section className="w-full bg-black/5 py-24 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-12">OMERTA {genero}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {actual.lookbook.map((item, i) => (
              <motion.div key={item.title + genero} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden bg-gray-200 relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="mt-4 flex items-center gap-1 font-black uppercase tracking-tighter text-lg italic">
                  {item.title} <ChevronRight size={20} />
                </div>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECCIÓN PROTOCOLO --- */}
      <section className="w-full bg-black text-white py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.9] mb-8">OMERTA NO ES <br /> UNA ETIQUETA. <br /> ES UN PROTOCOLO.</h2>
            <Link href="/about" className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform">
              Entrar al Archivo <ArrowRight size={16} />
            </Link>
          </div>
          <div className="aspect-square bg-zinc-900 rounded-3xl overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=1000" className="w-full h-full object-cover opacity-80" alt="Protocol" />
          </div>
        </div>
      </section>

      {/* --- ÚLTIMOS LANZAMIENTOS CON FILTRO INTELIGENTE --- */}
      <section className="w-full py-24 pl-4 md:pl-12 bg-white overflow-hidden relative z-10">
        <h3 className="text-2xl font-black tracking-tighter uppercase mb-12">
          {cargandoShopify ? "SINCRONIZANDO ARSENAL..." : `Últimos Lanzamientos ${genero}`}
        </h3>
        <div className="flex overflow-x-auto gap-6 md:gap-10 pb-8 no-scrollbar snap-x">

          {productosFiltrados.length > 0 ? productosFiltrados.map((prod) => {
            const esFavorito = (favoritos || []).some((f: any) => f.id === prod.id);
            return (
              <div key={prod.id} className="w-[220px] md:w-[350px] lg:w-[400px] flex-none snap-center group relative flex flex-col cursor-pointer">
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorito(prod); }}
                  className="absolute top-4 right-4 z-20 p-2 md:p-3 bg-white/80 backdrop-blur-md rounded-full border border-gray-100 shadow-sm hover:scale-110 transition-all"
                >
                  <motion.div key={esFavorito ? "full" : "empty"} initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                    <Heart size={18} className={esFavorito ? "text-red-500 fill-red-500" : "text-gray-400"} />
                  </motion.div>
                </button>

                <div className="aspect-[4/5] bg-[#f8f8f8] mb-4 md:mb-6 relative overflow-hidden rounded-2xl md:rounded-3xl">
                  <Link href={`/products/${prod.handle}`} className="block w-full h-full">
                    <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </Link>
                  <div className="absolute bottom-0 w-full p-4 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 pointer-events-none md:pointer-events-auto">
                    <Link href={`/products/${prod.handle}`} className="pointer-events-auto">
                      <div className="w-full bg-black text-white text-[10px] md:text-xs font-bold px-6 py-5 md:py-6 uppercase tracking-widest shadow-lg flex justify-center items-center rounded-xl md:rounded-2xl">
                        Selecciona tu talla
                      </div>
                    </Link>
                  </div>
                </div>

                <Link href={`/products/${prod.handle}`}>
                  <h4 className="font-bold text-xs md:text-sm uppercase tracking-widest truncate hover:text-gray-500 transition-colors">{prod.name}</h4>
                  <p className="text-gray-400 text-xs md:text-sm mt-1">{prod.price}</p>
                </Link>
              </div>
            );
          }) : (
            !cargandoShopify && (
              <div className="text-xs font-bold text-gray-400 py-10 uppercase tracking-widest text-center w-full">
                No hay nuevos lanzamientos en este sector.
              </div>
            )
          )}
        </div>
      </section>

      {/* --- FOOTER DE CATEGORÍAS --- */}
      <section className="bg-[#f9f9f9] py-24 px-6 border-t border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div>
            <h4 className="font-black uppercase tracking-[0.2em] border-b-2 border-black pb-4 mb-8 text-sm">OMERTA Men Archive</h4>
            <ul className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              {["Playeras", "Oversize Heavy", "Manga Larga", "Hoodies", "Crewnecks", "Cargos", "Joggers", "Shorts"].map(item => (
                <li key={item} className="hover:text-black transition-colors"><Link href={`/categoria/${crearSlug('men-' + item)}`}>{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-[0.2em] border-b-2 border-[#A89F91] pb-4 mb-8 text-sm">OMERTA Woman Archive</h4>
            <ul className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              {["Baby Tees", "Oversize", "Hoodies", "Bodysuits", "Wide Pants", "Leggings", "Biker Shorts"].map(item => (
                <li key={item} className="hover:text-black transition-colors"><Link href={`/categoria/${crearSlug('woman-' + item)}`}>{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-[0.2em] border-b-2 border-gray-400 pb-4 mb-8 text-sm">Accesorios</h4>
            <ul className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              {["Snapbacks", "Dad Hats", "Beanies", "Mochilas Tácticas", "Fundas Celular", "Calcetines", "Accesorios"].map(item => (
                <li key={item} className="hover:text-black transition-colors"><Link href={`/categoria/${crearSlug('accesorios-' + item)}`}>{item}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="bg-[#111] text-white py-20 text-center relative z-10">
        <div className="text-3xl font-black tracking-[0.5em] mb-6 italic">OMERTA</div>
        <p className="text-gray-600 text-[10px] uppercase tracking-widest font-mono">© 2026 ARCHIVE PROTOCOL. ALL RIGHTS RESERVED.</p>
      </footer>
    </motion.div>
  );
}