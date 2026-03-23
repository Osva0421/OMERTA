"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts } from '../lib/shopify';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

function ResultadosBusqueda() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const [productos, setProductos] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        async function buscarEnCatalogo() {
            const data = await getProducts();
            const formateados = data.map((item: any) => ({
                id: item.node.id,
                handle: item.node.handle,
                name: item.node.title,
                price: `$${parseFloat(item.node.priceRange.minVariantPrice.amount).toLocaleString()} MXN`,
                img: item.node.images.edges?.[0]?.node?.url,
            }));

            const resultados = formateados.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase())
            );

            setProductos(resultados);
            setCargando(false);
        }

        if (query) {
            buscarEnCatalogo();
        } else {
            setCargando(false);
        }
    }, [query]);

    if (cargando) {
        return <div className="min-h-screen flex items-center justify-center font-mono text-xs uppercase tracking-[0.5em] animate-pulse">Buscando en el archivo...</div>;
    }

    return (
        <div className="min-h-screen bg-white text-black font-sans pb-24">
            <header className="px-4 py-8 md:p-12 max-w-7xl mx-auto flex items-center gap-4">
                <Link href="/" className="p-3 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">Resultados de Búsqueda</h1>
                    <p className="text-sm font-mono text-gray-500 mt-1">Buscaste: "{query}"</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-12">
                {productos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                        {productos.map((prod) => (
                            <div key={prod.id} className="group relative flex flex-col cursor-pointer">
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
                                    {/* FIX: El precio está de vuelta en la página de resultados */}
                                    <p className="text-gray-400 text-xs mt-1">{prod.price}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 flex flex-col items-center justify-center text-center">
                        <Search size={48} className="text-gray-200 mb-6" />
                        <h2 className="text-xl font-black uppercase tracking-widest text-gray-400">Sin coincidencias</h2>
                        <p className="text-sm text-gray-400 mt-2 font-mono">No encontramos nada para "{query}" en el archivo principal.</p>
                        <Link href="/" className="mt-8 px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-800 transition-colors">
                            Volver al inicio
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function BuscarPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-mono text-xs uppercase tracking-[0.5em] animate-pulse">Accediendo al archivo...</div>}>
            <ResultadosBusqueda />
        </Suspense>
    );
}