import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EnviosPage() {
    return (
        <div className="min-h-screen bg-[#fcfcfc] text-black font-sans selection:bg-black selection:text-white">
            <div className="max-w-3xl mx-auto px-6 py-20 md:py-32">

                {/* BOTÓN DE REGRESO */}
                <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] mb-12 hover:opacity-50 transition-opacity text-gray-500">
                    <ArrowLeft size={14} /> Volver al Inicio
                </Link>

                {/* TÍTULO ESTILO OMERTA */}
                <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-16">
                    Protocolo <br /><span className="text-gray-400">de Envíos</span>
                </h1>

                {/* CONTENIDO REDACTADO */}
                <div className="space-y-12 text-sm md:text-base leading-relaxed text-gray-600">

                    <section>
                        <h2 className="text-lg font-black text-black uppercase tracking-widest mb-4">Tiempos de Entrega</h2>
                        <p>Operamos bajo un modelo de producción bajo demanda (Print on Demand) para evitar la sobreproducción y garantizar la calidad de cada pieza. Tu orden será procesada y fabricada de manera exclusiva para ti.</p>
                        <p className="mt-4">El tiempo estimado de entrega total en México es de <strong className="text-black">7 a 10 días hábiles</strong>.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-black uppercase tracking-widest mb-4">Tarifas de Envío</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong className="text-black">Envío Estándar (México):</strong> $150.00 MXN.</li>
                            <li><strong className="text-black">Envío Gratuito:</strong> En todas las órdenes superiores a $1,050.00 MXN.</li>
                            <li><strong className="text-black">Internacional (Norteamérica):</strong> $150.00 MXN.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-black uppercase tracking-widest mb-4">Rastreo de Orden</h2>
                        <p>Una vez que tu pieza esté lista y haya salido de nuestras instalaciones, recibirás un correo electrónico a la dirección proporcionada con tu número de guía oficial para que puedas monitorear su trayecto en todo momento.</p>
                    </section>

                </div>
            </div>
        </div>
    );
}