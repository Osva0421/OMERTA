"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Bell, ChevronRight, Heart, LayoutGrid, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- IMPORTAMOS EL CEREBRO GLOBAL Y SHOPIFY ---
import { useCartStore } from './store/useCartStore';
import { getProducts } from './lib/shopify';

// =====================================================================
// FUNCIONES AUXILIARES
// =====================================================================
const crearSlug = (texto: string) => {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
};

// =====================================================================
// NUEVO MOTOR: TARJETA INTERACTIVA CON SLIDESHOW
// =====================================================================
function TarjetaProductoInteractiva({ prod, favoritos, manejarFavoritoDefault }: any) {
  const [indiceActivo, setIndiceActivo] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const iniciarHover = () => {
    if (window.matchMedia("(min-width: 768px)").matches && prod.galeria && prod.galeria.length > 1) {
      timerRef.current = setInterval(() => {
        setIndiceActivo((prev) => (prev + 1) % prod.galeria.length);
      }, 1200);
    }
  };

  const detenerHover = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIndiceActivo(0);
  };

  const esFavorito = (favoritos || []).some((f: any) => f.shopifyId === prod.shopifyId);

  return (
    <div
      className="w-[220px] md:w-[350px] lg:w-[400px] flex-none snap-center group relative flex flex-col cursor-pointer"
      onMouseEnter={iniciarHover}
      onMouseLeave={detenerHover}
    >
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); manejarFavoritoDefault(prod); }}
        className="absolute top-4 right-4 z-20 p-2 md:p-3 bg-white/80 backdrop-blur-md rounded-full border border-gray-100 shadow-sm hover:scale-110 transition-all"
      >
        <motion.div key={esFavorito ? "full" : "empty"} animate={{ scale: esFavorito ? [1, 1.3, 1] : 1 }}>
          <Heart size={18} className={esFavorito ? "text-red-500 fill-red-500" : "text-gray-400"} />
        </motion.div>
      </button>

      <div className="aspect-[4/5] bg-[#f8f8f8] mb-4 md:mb-6 relative overflow-hidden rounded-2xl md:rounded-3xl">
        <div className="w-full h-full flex overflow-x-auto md:overflow-hidden snap-x snap-mandatory no-scrollbar relative z-10">
          {prod.galeria.map((imgUrl: string, i: number) => (
            <Link
              key={i}
              href={`/products/${prod.handle}`}
              className="w-full h-full flex-none snap-center relative"
              style={{ transform: `translateX(-${indiceActivo * 100}%)`, transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' }}
            >
              <img src={imgUrl} alt={`${prod.name} - Vista ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </Link>
          ))}
        </div>

        <div className="absolute bottom-0 w-full p-4 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 pointer-events-none md:pointer-events-auto relative z-20">
          <Link href={`/products/${prod.handle}`} className="pointer-events-auto block">
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
}

// =====================================================================
// PÁGINA PRINCIPAL
// =====================================================================
export default function InicioOMERTA() {
  const router = useRouter();
  const { carrito = [], favoritos = [], toggleFavorito } = useCartStore();
  const [genero, setGenero] = useState<'MEN' | 'WOMAN'>('MEN');
  const [isLoggedIn] = useState(false);
  const userName = "Osva";

  const [productosShopify, setProductosShopify] = useState<any[]>([]);
  const [cargandoShopify, setCargandoShopify] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [mostrandoResultados, setMostrandoResultados] = useState(false);

  // --- Carga de Shopify ---
  useEffect(() => {
    async function extraerArsenal() {
      try {
        const data = await getProducts();
        const formateados = data.map((item: any) => {
          const primeraVariante = item.node.variants?.edges?.[0]?.node;
          const galeriaCompleta = item.node.images.edges.map((e: any) => e.node.url);
          return {
            id: item.node.id, handle: item.node.handle, shopifyId: primeraVariante?.id || "ID_VACIO",
            variantTitle: primeraVariante?.title || "Unitalla", name: item.node.title,
            price: `$${parseFloat(item.node.priceRange.minVariantPrice.amount).toLocaleString()} MXN`,
            rawPrice: parseFloat(item.node.priceRange.minVariantPrice.amount),
            img: primeraVariante?.image?.url || item.node.images.edges?.[0]?.node?.url || '',
            galeria: galeriaCompleta, tags: item.node.tags || [],
            tituloVariante: item.node.variants?.edges?.[0]?.node?.title || "Unitalla"
          };
        });
        setProductosShopify(formateados);
      } catch (error) { console.error(error); } finally { setCargandoShopify(false); }
    }
    extraerArsenal();
  }, []);

  const totalDineroCarrito = carrito?.reduce((total, item) => total + ((item.rawPrice || 0) * (item.cantidad || 1)), 0) || 0;
  const META_ENVIO_GRATIS = 1050;
  const faltaParaEnvio = META_ENVIO_GRATIS - totalDineroCarrito;
  const cantidadTotalCarrito = carrito?.reduce((total, item) => total + (item.cantidad || 1), 0) || 0;
  const cantidadTotalCloset = favoritos?.length || 0;

  const productosFiltrados = productosShopify.filter((prod) => {
    const prefijo = genero === 'MEN' ? 'men-' : 'woman-';
    return prod.tags.some((tag: string) => tag.toLowerCase().startsWith(prefijo));
  });

  const resultadosBusqueda = terminoBusqueda.trim() === '' ? [] : productosShopify.filter(p => p.name.toLowerCase().includes(terminoBusqueda.toLowerCase()));

  const ejecutarBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    if (terminoBusqueda.trim()) router.push(`/buscar?q=${encodeURIComponent(terminoBusqueda)}`);
  };

  const manejarFavoritoDefault = (prod: any) => {
    let varTitle = prod.tituloVariante.replace(/\s*\/\s*/g, ' - ');
    if (varTitle.toLowerCase() === 'default title') varTitle = 'Unitalla';
    const prendaParaCloset = { id: prod.id, shopifyId: prod.shopifyId, name: `${prod.name} (${varTitle})`, price: prod.price, rawPrice: prod.rawPrice, img: prod.img };
    toggleFavorito(prendaParaCloset);
  };

  const config = {
    MEN: { bgColor: '#ffffff', textColor: '#111111', subCategorias: ["Playeras", "Oversize", "Hoodies", "Pantalones", "Accesorios"] },
    WOMAN: { bgColor: '#E5DFD3', textColor: '#1a1a1a', subCategorias: ["Baby Tees", "Oversize", "Hoodies", "Leggings", "Accesorios"] }
  };

  const actual = config[genero];
  const categoriasMostrar = genero === 'MEN' ? ["Playeras", "Oversize", "Hoodies"] : ["Baby Tees", "Oversize", "Hoodies"];

  const scrollToContent = () => { document.getElementById('archivo-lanzamientos')?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <motion.div
      className="min-h-screen transition-colors duration-700 ease-in-out selection:bg-black selection:text-white font-sans"
      animate={{ backgroundColor: actual.bgColor, color: actual.textColor }}
    >
      {/* CSS: SIN CURSOR PERSONALIZADO */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@200;400;700&display=swap');

        .hero-wrap { position:relative; width:100%; height:80vh; display:flex !important; flex-direction: row !important; overflow:hidden; background:#111; cursor: default; }
        
        .hero-divider { position:absolute; left:50%; top:0; bottom:0; width:1px; background:rgba(255,255,255,0.3); z-index:20; transform:translateX(-50%); transition:left .75s cubic-bezier(.77,0,.18,1); }
        .hero-wrap:has(.side-w:hover) .hero-divider { left:58%; }
        .hero-wrap:has(.side-m:hover) .hero-divider { left:42%; }

        .hero-side { position:relative; height:100%; overflow:hidden; width:50% !important; transition:width .75s cubic-bezier(.77,0,.18,1); flex-shrink:0; cursor: pointer; }
        .hero-wrap:has(.side-w:hover) .side-w { width:58% !important; }
        .hero-wrap:has(.side-w:hover) .side-m { width:42% !important; }
        .hero-wrap:has(.side-m:hover) .side-m { width:58% !important; }
        .hero-wrap:has(.side-m:hover) .side-w { width:42% !important; }

        .bg-wrap { position:absolute; inset:0; overflow:hidden; }
        .bg-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform .75s cubic-bezier(.77,0,.18,1), filter .75s ease; }
        
        .hero-side:hover .bg-wrap img { transform: scale(1.04); filter: brightness(0.75); }

        .hero-overlay { position:absolute; inset:0; opacity:0; z-index:2; transition:opacity .75s ease; pointer-events:none; background: rgba(0,0,0,0.2); }
        .hero-side:hover .hero-overlay { opacity:1; }

        .cnt { position:absolute; inset:0; z-index:5; display:flex; flex-direction:column; justify-content:flex-end; padding: 30px; }
        .side-w .cnt { align-items:flex-start; text-align: left; }
        .side-m .cnt { align-items:flex-end; text-align:right; }

        .brand { font-family:'Cormorant Garamond',serif; font-size:clamp(1.5rem, 5vw, 4.5rem); color:#fff; text-transform:uppercase; line-height:1; margin-bottom:10px; text-shadow: 0 4px 10px rgba(0,0,0,0.3); }
        .tag { font-family:'Montserrat',sans-serif; font-size: 0.6rem; letter-spacing: 0.2em; color: rgba(255,255,255,0.7); text-transform: uppercase; }

        @media(max-width:768px){
          .hero-wrap { height: 60vh; flex-direction: row !important; }
          .hero-side { width: 50% !important; }
          .brand { font-size: 1.2rem; }
          .cnt { padding: 15px; }
          .tag { display: none; }
        }
      `}} />

      {/* --- HEADER --- */}
      <div className="sticky top-0 z-50 w-full flex flex-col">
        <header className="bg-white/80 backdrop-blur-md text-black px-4 py-4 border-b border-gray-100 relative">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-4 gap-x-3">
            <Link href="/" className="flex-shrink-0">
              <img src="/monograma-omerta.png" alt="OMERTA" className="h-10 md:h-12 w-auto hover:scale-105 transition-transform" />
            </Link>

            <div className="w-full order-last lg:order-none lg:flex-1 lg:max-w-xl mx-auto relative z-50">
              <form onSubmit={ejecutarBusqueda} className="flex items-center bg-white rounded-full px-5 py-3 border border-gray-200 shadow-sm focus-within:border-black transition-all">
                <button type="submit"><Search size={16} className="text-gray-400 mr-3" /></button>
                <input type="text" value={terminoBusqueda} onChange={(e) => setTerminoBusqueda(e.target.value)} placeholder="Buscar en el archivo..." className="w-full bg-transparent outline-none text-xs font-bold" />
              </form>
            </div>

            <div className="flex items-center space-x-4 md:space-x-8 text-[10px] font-black uppercase tracking-widest bg-black text-white px-5 py-3 rounded-full shadow-xl">
              <Link href="/closet" className="flex items-center gap-2 relative">
                <LayoutGrid size={16} /> <span className="hidden lg:inline">Closet</span>
                {cantidadTotalCloset > 0 && <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-black">{cantidadTotalCloset}</span>}
              </Link>
              <button className="flex items-center gap-2"><Bell size={16} /></button>
              <Link href="/login" className="flex items-center gap-2"><User size={16} /><span className="hidden lg:inline">{isLoggedIn ? userName : 'Entrar'}</span></Link>
              <div className="w-[1px] h-4 bg-zinc-700 hidden lg:block"></div>
              <Link href="/carrito" className="flex items-center gap-2 relative">
                <ShoppingBag size={16} /> <span className="hidden lg:inline">Carrito</span>
                {cantidadTotalCarrito > 0 && <span className="absolute -top-2 -right-3 bg-white text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-black">{cantidadTotalCarrito}</span>}
              </Link>
            </div>
          </div>
        </header>
        <div className="bg-black text-white py-2 px-4 text-center text-[10px] md:text-xs font-black uppercase tracking-widest shadow-md">
          {totalDineroCarrito >= META_ENVIO_GRATIS ? "¡HAS DESBLOQUEADO EL ENVÍO GRATIS! 🚚" : `FALTAN $${faltaParaEnvio} MXN PARA ENVÍO GRATIS 📦`}
        </div>
      </div>

      {/* --- HERO DIVIDIDO --- */}
      <div className="hero-wrap" id="omerta-split-hero">
        <div className="hero-side side-w" onClick={() => { setGenero('WOMAN'); scrollToContent(); }}>
          <div className="bg-wrap">
            <img src="/omerta-woman.png" alt="Omerta Woman" />
          </div>
          <div className="hero-overlay"></div>
          <div className="cnt">
            <div className="tag">Colección</div>
            <div className="brand">Omerta<br />Woman</div>
          </div>
        </div>

        <div className="hero-divider"></div>

        <div className="hero-side side-m" onClick={() => { setGenero('MEN'); scrollToContent(); }}>
          <div className="bg-wrap">
            <img src="/omerta-men.png" alt="Omerta Men" />
          </div>
          <div className="hero-overlay"></div>
          <div className="cnt">
            <div className="tag">Colección</div>
            <div className="brand">Omerta<br />Men</div>
          </div>
        </div>
      </div>

      {/* --- NAVEGACIÓN --- */}
      <nav id="archivo-lanzamientos" className="w-full pt-10 pb-8 flex flex-col items-center gap-8 border-b border-gray-100">
        <div className="flex overflow-x-auto justify-center gap-10 no-scrollbar px-4 w-full">
          {actual.subCategorias.map((sub) => (
            <Link key={sub + genero} href={`/categoria/${crearSlug(genero + '-' + sub)}`} className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors whitespace-nowrap">{sub}</Link>
          ))}
        </div>
      </nav>

      {/* --- LANZAMIENTOS --- */}
      <section className="w-full py-24 pl-4 md:pl-12 bg-white overflow-hidden relative z-10">
        <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-16 italic text-gray-200">ARCHIVO {genero}</h3>
        {categoriasMostrar.map(cat => {
          const categoriaSlug = crearSlug(cat);
          const productosDeEstaCategoria = productosFiltrados.filter(p => p.tags.some((tag: string) => tag.toLowerCase().includes(categoriaSlug)));
          if (productosDeEstaCategoria.length === 0) return null;
          return (
            <div key={cat} className="mb-20">
              <h4 className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] text-black border-l-4 border-black pl-4 mb-8">NUEVAS {cat}</h4>
              <div className="flex overflow-x-auto gap-6 md:gap-10 pb-8 no-scrollbar snap-x">
                {productosDeEstaCategoria.map((prod) => (
                  <TarjetaProductoInteractiva key={prod.id} prod={prod} favoritos={favoritos} manejarFavoritoDefault={manejarFavoritoDefault} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <footer className="bg-[#111] text-white py-20 text-center">
        <div className="text-3xl font-black tracking-[0.5em] mb-6 italic">OMERTA</div>
        <p className="text-gray-600 text-[10px] uppercase tracking-widest font-mono">© 2026 ARCHIVE PROTOCOL. ALL RIGHTS RESERVED.</p>
      </footer>
    </motion.div>
  );
}