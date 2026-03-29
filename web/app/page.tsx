"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Bell, ChevronRight, Heart, LayoutGrid, User, ArrowRight, Instagram } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from './store/useCartStore';
import { getProducts } from './lib/shopify';

const crearSlug = (texto: string) => {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
};

// =====================================================================
// COMPONENTE: TARJETA DE PRODUCTO ESTRELLA (DISEÑO MEN: 01, 02, 03)
// =====================================================================
function StarProductCard({ prod, number, title, description, reverse, imagenManual }: any) {
  const router = useRouter();
  // AQUÍ YA USAMOS agregarPrenda
  const { agregarPrenda } = useCartStore();

  const manejarAñadirAlCarrito = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const varianteTitle = prod.tituloVariante && prod.tituloVariante.toLowerCase() !== 'default title'
      ? prod.tituloVariante
      : 'Unitalla';

    const prendaParaCarrito = {
      id: prod.id, shopifyId: prod.shopifyId, handle: prod.handle,
      name: `${prod.name} (${varianteTitle})`, price: prod.price, rawPrice: prod.rawPrice,
      img: prod.imagenVariante || prod.img, variantTitle: varianteTitle, cantidad: 1,
    };

    // AQUÍ YA USAMOS agregarPrenda
    agregarPrenda(prendaParaCarrito);
    alert(`¡${prod.name} añadido al Carrito!`);
  };

  if (!prod) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
      className={`max-w-6xl mx-auto flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24 mb-32 px-6`}
    >
      <div className="w-full md:w-1/2 flex justify-center relative group">
        <Link href={`/products/${prod.handle}`} className="block relative overflow-hidden rounded-3xl">
          <img src={imagenManual} alt={prod.name} className="w-full max-w-md object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-md">Ver Tallas</span>
          </div>
        </Link>
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <span className="text-[#D8CFC4] font-black text-6xl md:text-8xl mb-2 font-sans">{number}</span>
        <h3 className="text-4xl md:text-6xl font-black text-black leading-tight mb-6 tracking-tighter uppercase font-sans">{title}</h3>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-10 font-sans">{description}</p>

        <div className="flex flex-wrap gap-4 font-sans">
          <button onClick={manejarAñadirAlCarrito} className="bg-[#111] text-white px-8 py-4 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-black/80 transition-colors">Añadir a Bolsa</button>
          <Link href={`/products/${prod.handle}`} className="bg-white text-black border border-gray-200 px-8 py-4 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center gap-2">Seleccionar Talla <ArrowRight size={14} /></Link>
        </div>
      </div>
    </motion.div>
  );
}

// =====================================================================
// NUEVO COMPONENTE: CATEGORÍA WOMAN MINIMALISTA
// =====================================================================
function WomanCategoryRect({ title, subtitle, imgUrl, link }: { title: string, subtitle: string, imgUrl: string, link: string }) {
  return (
    <Link href={link} className="group flex flex-col text-left font-sans">
      <div className="w-full aspect-[4/5] overflow-hidden bg-[#f3f3f3] mb-4">
        <img src={imgUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      </div>
      <h4 className="font-bold text-xl md:text-2xl text-black mb-1 tracking-tight">{title}</h4>
      <p className="text-gray-500 text-xs md:text-sm mb-3">{subtitle}</p>
      <span className="font-bold text-xs text-black flex items-center gap-2 group-hover:gap-3 transition-all">
        Descubrir <ArrowRight size={14} />
      </span>
    </Link>
  );
}

// =====================================================================
// MOTOR DE TARJETAS (SLIDESHOW) - Para "Nuevos Lanzamientos"
// =====================================================================
function TarjetaProductoInteractiva({ prod, favoritos, manejarFavoritoDefault }: any) {
  const [indiceActivo, setIndiceActivo] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const iniciarHover = () => {
    if (window.matchMedia("(min-width: 768px)").matches && prod.galeria && prod.galeria.length > 1) {
      timerRef.current = setInterval(() => setIndiceActivo((prev) => (prev + 1) % prod.galeria.length), 1200);
    }
  };

  const detenerHover = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIndiceActivo(0);
  };

  const esFavorito = (favoritos || []).some((f: any) => f.shopifyId === prod.shopifyId);

  return (
    <div className="w-[220px] md:w-[350px] lg:w-[400px] flex-none snap-center group relative flex flex-col cursor-pointer font-sans" onMouseEnter={iniciarHover} onMouseLeave={detenerHover}>
      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); manejarFavoritoDefault(prod); }} className="absolute top-4 right-4 z-20 p-2 md:p-3 bg-white/80 backdrop-blur-md rounded-full border border-gray-100 shadow-sm hover:scale-110 transition-all">
        <motion.div key={esFavorito ? "full" : "empty"} animate={{ scale: esFavorito ? [1, 1.3, 1] : 1 }}>
          <Heart size={18} className={esFavorito ? "text-red-500 fill-red-500" : "text-gray-400"} />
        </motion.div>
      </button>
      <div className="aspect-[4/5] bg-[#f8f8f8] mb-4 md:mb-6 relative overflow-hidden rounded-2xl md:rounded-3xl">
        <div className="w-full h-full flex overflow-x-auto md:overflow-hidden snap-x snap-mandatory no-scrollbar relative z-10">
          {prod.galeria.map((imgUrl: string, i: number) => (
            <Link key={i} href={`/products/${prod.handle}`} className="w-full h-full flex-none snap-center relative" style={{ transform: `translateX(-${indiceActivo * 100}%)`, transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' }}>
              <img src={imgUrl} alt={`${prod.name} - Vista ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </Link>
          ))}
        </div>
        <div className="absolute bottom-0 w-full p-4 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 pointer-events-none md:pointer-events-auto relative z-20">
          <Link href={`/products/${prod.handle}`} className="pointer-events-auto block">
            <div className="w-full bg-black text-white text-[10px] md:text-xs font-bold px-6 py-5 md:py-6 uppercase tracking-widest shadow-lg flex justify-center items-center rounded-xl md:rounded-2xl">Selecciona tu talla</div>
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
  // AQUÍ YA USAMOS agregarPrenda en vez de setCantidad
  const { carrito = [], favoritos = [], toggleFavorito, agregarPrenda } = useCartStore();
  const [genero, setGenero] = useState<'MEN' | 'WOMAN'>('MEN');
  const [isLoggedIn] = useState(false);
  const userName = "Osva";

  const [productosShopify, setProductosShopify] = useState<any[]>([]);
  const [cargandoShopify, setCargandoShopify] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [mostrandoResultados, setMostrandoResultados] = useState(false);

  // --- Lógica del Cursor Personalizado ---
  useEffect(() => {
    const cur = document.getElementById('cur');
    const ring = document.getElementById('ring');
    const heroSection = document.getElementById('omerta-split-hero');

    const handleMouseMove = (e: MouseEvent) => {
      if (cur && ring && heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const isHoveringHero = (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom);
        if (isHoveringHero) {
          cur.style.opacity = '1'; ring.style.opacity = '1';
          cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px';
          ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
        } else {
          cur.style.opacity = '0'; ring.style.opacity = '0';
        }
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const hoverRing = () => document.getElementById('ring')?.classList.add('big');
  const unhoverRing = () => document.getElementById('ring')?.classList.remove('big');

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

  // --- OBTENEMOS LOS PRODUCTOS ESTRELLA MEN ---
  const productoEstrellaMen1 = productosShopify.find(p => p.tags.some((t: string) => t.toLowerCase().trim() === 'estrella-1')) || productosFiltrados[0];
  const productoEstrellaMen2 = productosShopify.find(p => p.tags.some((t: string) => t.toLowerCase().trim() === 'estrella-2')) || productosFiltrados[1];
  const productoEstrellaMen3 = productosShopify.find(p => p.tags.some((t: string) => t.toLowerCase().trim() === 'estrella-3')) || productosFiltrados[2];

  // --- OBTENEMOS LOS PRODUCTOS ESTRELLA WOMAN (Nuevos tags: woman-1 y woman-2) ---
  const productoEstrellaWoman1 = productosShopify.find(p => p.tags.some((t: string) => t.toLowerCase().trim() === 'woman-1')) || productosFiltrados[0];
  const productoEstrellaWoman2 = productosShopify.find(p => p.tags.some((t: string) => t.toLowerCase().trim() === 'woman-2')) || (productosFiltrados.length > 1 ? productosFiltrados[1] : productosFiltrados[0]);

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

  // Función para manejar el carrito desde la sección Woman (Hero & Detalle)
  const añadirCarritoWoman = (e: React.MouseEvent, prod: any) => {
    e.preventDefault(); e.stopPropagation();
    if (!prod) return;
    const varianteTitle = prod.tituloVariante && prod.tituloVariante.toLowerCase() !== 'default title' ? prod.tituloVariante : 'Unitalla';
    const prendaParaCarrito = {
      id: prod.id, shopifyId: prod.shopifyId, handle: prod.handle,
      name: `${prod.name} (${varianteTitle})`, price: prod.price, rawPrice: prod.rawPrice,
      img: prod.imagenVariante || prod.img, variantTitle: varianteTitle, cantidad: 1,
    };

    // AQUÍ YA USAMOS agregarPrenda
    agregarPrenda(prendaParaCarrito);
    alert(`¡${prod.name} añadido a la bolsa!`);
  };

  const config = {
    MEN: { bgColor: '#ffffff', textColor: '#111111', subCategorias: ["Playeras", "Oversize", "Hoodies", "Pantalones", "Accesorios"] },
    WOMAN: { bgColor: '#ffffff', textColor: '#111111', subCategorias: ["Baby Tees", "Oversize", "Hoodies", "Leggings", "Accesorios"] }
  };

  const actual = config[genero];
  const categoriasMostrar = genero === 'MEN' ? ["Playeras", "Oversize", "Hoodies"] : ["Baby Tees", "Oversize", "Hoodies"];

  const scrollToContent = () => { document.getElementById('archivo-lanzamientos')?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <motion.div
      className="min-h-screen transition-colors duration-700 ease-in-out selection:bg-black selection:text-white font-sans"
      animate={{ backgroundColor: actual.bgColor, color: actual.textColor }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@200;400;600;700;900&display=swap');

        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Montserrat', sans-serif; }

        .custom-cursor { position:fixed; width:8px; height:8px; background:white; border-radius:50%; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); mix-blend-mode:difference; opacity: 0; transition: opacity 0.3s; }
        .custom-ring { position:fixed; width:34px; height:34px; border:1px solid white; border-radius:50%; pointer-events:none; z-index:9998; transform:translate(-50%,-50%); mix-blend-mode:difference; transition:width .3s ease, height .3s ease, opacity 0.3s; opacity: 0; }
        .custom-ring.big { width:58px; height:58px; }

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
      <div className="sticky top-0 z-50 w-full flex flex-col font-sans">
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

              <AnimatePresence>
                {mostrandoResultados && terminoBusqueda.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden z-[100] max-h-[60vh] overflow-y-auto">
                    {resultadosBusqueda.length > 0 ? (
                      <div className="p-2">
                        {resultadosBusqueda.map(prod => (
                          <Link key={prod.handle} href={`/products/${prod.handle}`} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors group">
                            <div className="w-14 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                              <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 min-w-0"><h4 className="text-xs font-black uppercase tracking-widest truncate group-hover:text-gray-600 transition-colors">{prod.name}</h4></div>
                            <ChevronRight size={16} className="text-gray-300 group-hover:text-black transition-colors mr-2" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-10 text-center flex flex-col items-center justify-center">
                        <Search size={32} className="text-gray-200 mb-4" />
                        <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Sin coincidencias en el archivo</div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center space-x-4 md:space-x-8 text-[10px] font-black uppercase tracking-widest bg-black text-white px-5 py-3 rounded-full shadow-xl">
              <Link href="/closet" className="flex items-center gap-2 relative">
                <LayoutGrid size={16} /> <span className="hidden lg:inline">Closet</span>
                {cantidadTotalCloset > 0 && <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-black">{cantidadTotalCloset}</span>}
              </Link>
              <button className="hidden md:flex items-center gap-2"><Bell size={16} /></button>
              <Link href="/login" className="flex items-center gap-2"><User size={16} /><span className="hidden lg:inline">{isLoggedIn ? userName : 'Entrar'}</span></Link>
              <div className="w-[1px] h-4 bg-zinc-700 hidden lg:block"></div>
              <Link href="/carrito" className="flex items-center gap-2 relative">
                <ShoppingBag size={16} /> <span className="hidden lg:inline">Bolsa</span>
                {cantidadTotalCarrito > 0 && <span className="absolute -top-2 -right-3 bg-white text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-black">{cantidadTotalCarrito}</span>}
              </Link>
            </div>
          </div>
        </header>
        <div className="bg-black text-white py-2 px-4 text-center text-[10px] md:text-xs font-black uppercase tracking-widest shadow-md">
          {totalDineroCarrito >= META_ENVIO_GRATIS ? "¡HAS DESBLOQUEADO EL ENVÍO GRATIS! 🚚" : `FALTAN $${faltaParaEnvio} MXN PARA ENVÍO GRATIS 📦`}
        </div>
      </div>

      {/* --- HERO DIVIDIDO INICIAL --- */}
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

      {/* ========================================================= */}
      {/* SECCIÓN MEN (INTACTA) */}
      {/* ========================================================= */}
      {genero === 'MEN' && !cargandoShopify && (
        <section className="w-full bg-white py-12 md:py-24 relative z-10 overflow-hidden border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 mb-20 md:mb-32 text-center">
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-black mb-4 font-sans">
              La Base de tu Uniforme
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base font-serif text-lg">
              Nuestra selección esencial. Tres piezas diseñadas meticulosamente para ofrecer estructura, resistencia y versatilidad en las calles.
            </p>
          </div>

          <StarProductCard
            prod={productoEstrellaMen1}
            number="01"
            title="SOFT SILENCE"
            description="Diseñada para quienes encuentran estilo en la simplicidad. Su silueta amplia y relajada crea una caída natural que eleva cualquier look, manteniendo una estética limpia y contemporánea"
            reverse={false}
            imagenManual="/estrella-1.png"
          />
          <StarProductCard
            prod={productoEstrellaMen2}
            number="02"
            title="OVERSIZE OMERTA"
            description="Eleva tu estilo con una prenda que redefine lo esencial. Esta playera oversize combina una silueta relajada con una estética limpia y sofisticada, pensada para quienes valoran los detalles y la calidad en cada elemento"
            reverse={true}
            imagenManual="/estrella-2.png"
          />
          <StarProductCard
            prod={productoEstrellaMen3}
            number="03"
            title="HOODIE MONACO CIRCUIT"
            description="Estructura sólida, tacto ultra suave y diseño atemporal. Nuestra Premium Hoodie está construida para acompañarte en el día a día sin perder la forma ni el estilo"
            reverse={false}
            imagenManual="/estrella-3.png"
          />
        </section>
      )}

      {/* ========================================================= */}
      {/* SECCIÓN WOMAN (MINIMALISTA CON CLICK Y CARRITO ACTIVO Y TAGS SEPARADOS) */}
      {/* ========================================================= */}
      {genero === 'WOMAN' && !cargandoShopify && (
        <>
          {/* HÉROE MINIMALISTA (ESTILO 50/50 DE image_a95243.jpg) */}
          <section className="w-full flex flex-col md:flex-row min-h-[85vh] bg-white relative z-10 font-sans border-b border-gray-100">
            {/* Lado Texto */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-32 py-20 md:py-0">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">Para ti</span>
              <h2 className="text-6xl md:text-8xl font-bold text-black leading-[0.9] tracking-tighter mb-8">
                {productoEstrellaWoman1?.name || 'Boxy Cerezo'}
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-10 max-w-md">
                Descubre nuestra colección diseñada para la mujer moderna que valora la simplicidad y la calidad.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={(e) => añadirCarritoWoman(e, productoEstrellaWoman1)}
                  className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-colors rounded-none"
                >
                  Llevar al carrito
                </button>
                <Link
                  href={`/products/${productoEstrellaWoman1?.handle}`}
                  className="bg-white text-black border border-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors rounded-none flex items-center gap-2"
                >
                  Seleccionar Talla
                </Link>
              </div>
            </div>
            {/* Lado Imagen - Clickable */}
            <Link href={`/products/${productoEstrellaWoman1?.handle}`} className="w-full md:w-1/2 h-[50vh] md:h-auto bg-[#e5e9ea] block relative group cursor-pointer">
              <img src="/elegancia-1.png" alt="Woman Elegancia Atemporal" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white/90 backdrop-blur-sm text-black px-6 py-3 rounded-none font-bold text-xs uppercase tracking-widest shadow-md">Ver Producto</span>
              </div>
            </Link>
          </section>

          {/* SECCIÓN DE DETALLE ENUMERADA (Crop Top OMERTA - image_b83cfa.jpg) */}
          <section className="w-full py-20 md:py-32 relative z-10 bg-white font-sans border-b border-gray-100">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24 px-6">

              {/* Imagen de detalle minimalista - Clickable */}
              <Link href={`/products/${productoEstrellaWoman2?.handle}`} className="w-full md:w-1/2 aspect-square md:aspect-[4/5] bg-gray-100 overflow-hidden relative group cursor-pointer block">
                <img src="/elegancia-2.png" alt="Woman Detail Minimal" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 backdrop-blur-sm text-black px-6 py-3 rounded-none font-bold text-xs uppercase tracking-widest shadow-md">Ver Producto</span>
                </div>
              </Link>

              <div className="w-full md:w-1/2 flex flex-col justify-center text-left">
                <h3 className="text-4xl md:text-6xl font-bold text-black leading-tight tracking-tighter mb-8">
                  {productoEstrellaWoman2?.name || 'Crop Top OMERTA'}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-md">
                  Hecho para brillar con naturalidad
                </p>
                <ul className="list-disc pl-5 text-gray-600 text-sm md:text-base space-y-2 mb-10">
                  <li>Materiales premium sostenibles</li>
                  <li>Diseño atemporal</li>
                  <li>Hecha a tu medida</li>
                </ul>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={(e) => añadirCarritoWoman(e, productoEstrellaWoman2)}
                    className="inline-flex justify-center items-center bg-black text-white px-10 py-4 font-bold uppercase tracking-widest text-xs hover:bg-black/80 transition-colors rounded-none w-fit"
                  >
                    Llevar al carrito
                  </button>
                  <Link
                    href={`/products/${productoEstrellaWoman2?.handle}`}
                    className="inline-flex justify-center items-center bg-white text-black border border-gray-200 px-10 py-4 font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors rounded-none w-fit gap-2"
                  >
                    Seleccionar talla <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN: EXPLORA POR CATEGORÍA */}
          <section className="w-full py-20 md:py-32 bg-white z-10 relative font-sans border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tighter">Explora por Categoría</h2>
              <p className="text-gray-500 text-sm md:text-base">Piezas cuidadosamente seleccionadas para cada ocasión</p>
            </div>

            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-12">
              <WomanCategoryRect title="Blusas" subtitle="Sofisticación para cada día" imgUrl="/blusas-woman.png" link={`/categoria/${crearSlug('woman-blusas')}`} />
              <WomanCategoryRect title="Playera Oversize" subtitle="Comodidad sin esfuerzo" imgUrl="/oversize-woman.png" link={`/categoria/${crearSlug('woman-playeras-oversize')}`} />
              <WomanCategoryRect title="Hoodies" subtitle="Esenciales urbanos" imgUrl="/hoodie-woman.png" link={`/categoria/${crearSlug('woman-hoodies')}`} />
              <WomanCategoryRect title="Baby Tees" subtitle="Ajuste perfecto" imgUrl="/baby-tees-woman.png" link={`/categoria/${crearSlug('woman-baby-tees')}`} />
              <WomanCategoryRect title="Tirantes" subtitle="Detalles que marcan la diferencia" imgUrl="/tirantes-woman.png" link={`/categoria/${crearSlug('woman-tirantes')}`} />
              <WomanCategoryRect title="Accesorios" subtitle="Explora el archivo completo" imgUrl="/accesorios.png" link={`/categoria/${crearSlug('accesorios')}`} />
            </div>
          </section>
        </>
      )}

      {/* ========================================================= */}
      {/* SECCIÓN NUEVOS LANZAMIENTOS (AMBOS GÉNEROS) */}
      {/* ========================================================= */}
      <section className="w-full py-24 pl-4 md:pl-12 bg-white overflow-hidden relative z-10">
        <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-16 italic text-gray-200">
          {cargandoShopify ? "SINCRONIZANDO ARSENAL..." : `ARCHIVO ${genero}`}
        </h3>

        {!cargandoShopify && categoriasMostrar.map(cat => {
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

      {/* --- PIE DE PÁGINA (ADAPTADO CON REDES) --- */}
      <footer className="bg-white border-t border-gray-200 py-20 relative z-10 font-sans">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h4 className="font-bold text-xl text-black tracking-tighter mb-4">MINIMAL</h4>
            <p className="text-gray-500 text-sm leading-relaxed">Moda minimalista para la mujer y el hombre contemporáneo.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm text-black mb-6 tracking-wide">TIENDA</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><Link href={`/categoria/${crearSlug(genero + '-playeras')}`} className="hover:text-black">Nueva Colección</Link></li>
              <li><Link href={`/categoria/${crearSlug('woman-blusas')}`} className="hover:text-black">Blusas</Link></li>
              <li><Link href={`/categoria/${crearSlug(genero + '-hoodies')}`} className="hover:text-black">Hoodies</Link></li>
              <li><Link href={`/categoria/${crearSlug(genero + '-accesorios')}`} className="hover:text-black">Accesorios</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm text-black mb-6 tracking-wide">AYUDA</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><Link href="/contacto" className="hover:text-black">Contacto</Link></li>
              <li><Link href="/envios" className="hover:text-black">Envíos</Link></li>
              <li><Link href="/devoluciones" className="hover:text-black">Devoluciones</Link></li>
              <li><Link href="/faq" className="hover:text-black">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm text-black mb-6 tracking-wide">SÍGUENOS</h4>
            <p className="text-gray-500 text-sm mb-6">Únete a nuestra comunidad.</p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/omerta.wrld?igsh=NGNhaXRsNjVkdzN4&utm_source=qr" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://www.tiktok.com/@omerta0398?_r=1&_t=ZS-953R8RpeaUn" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors">
                {/* SVG manual para TikTok */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 text-center">
          <div className="text-2xl font-black tracking-[0.5em] mb-4 text-black">OMERTA</div>
          <p className="text-gray-400 text-xs uppercase tracking-widest font-mono">© 2026 ARCHIVE PROTOCOL. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </motion.div>
  );
}