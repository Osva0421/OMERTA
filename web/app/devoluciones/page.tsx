import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DevolucionesPage() {
    return (
        <div className="min-h-screen bg-[#fcfcfc] text-black font-sans selection:bg-black selection:text-white">
            <div className="max-w-3xl mx-auto px-6 py-20 md:py-32">

                <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] mb-12 hover:opacity-50 transition-opacity text-gray-500">
                    <ArrowLeft size={14} /> Volver al Inicio
                </Link>

                <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-16">
                    Protocolo <br /><span className="text-gray-400">de Retornos</span>
                </h1>

                <div className="space-y-12 text-sm md:text-base leading-relaxed text-gray-600">

                    <section>
                        <h2 className="text-lg font-black text-black uppercase tracking-widest mb-4">Cambios y Devoluciones</h2>
                        <p>Cada pieza de OMERTA se fabrica de manera exclusiva en el momento de tu compra (Print on Demand). Por esta razón, <strong className="text-black">no realizamos cambios ni devoluciones por errores en la elección de talla o arrepentimiento de compra</strong>.</p>
                        <p className="mt-4">Te sugerimos revisar cuidadosamente nuestra Guía de Tallas en la página de cada producto antes de finalizar tu orden para asegurar el ajuste perfecto.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-black uppercase tracking-widest mb-4">Garantía de Calidad</h2>
                        <p>Si tu pieza llega con algún defecto de fábrica, daño durante el envío o error en la impresión, el Archivo asume el 100% de la responsabilidad.</p>
                        <p className="mt-4">Tienes un plazo de <strong className="text-black">30 días</strong> desde la recepción del producto para contactarnos a <a href="mailto:omerta2104@gmail.com" className="text-black font-bold underline">omerta2104@gmail.com</a> adjuntando fotografías claras del defecto. Una vez evaluado, procesaremos un reemplazo sin costo alguno para ti.</p>
                    </section>

                </div>
            </div>
        </div>
    );
}