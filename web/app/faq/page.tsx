import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-[#fcfcfc] text-black font-sans selection:bg-black selection:text-white">
            <div className="max-w-3xl mx-auto px-6 py-20 md:py-32">

                <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] mb-12 hover:opacity-50 transition-opacity text-gray-500">
                    <ArrowLeft size={14} /> Volver al Inicio
                </Link>

                <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-16">
                    Preguntas <br /><span className="text-gray-400">Frecuentes</span>
                </h1>

                <div className="space-y-12 text-sm md:text-base leading-relaxed text-gray-600">

                    <div className="space-y-4">
                        <h2 className="text-lg font-black text-black uppercase tracking-widest">¿Es seguro comprar aquí?</h2>
                        <p>Totalmente. OMERTA utiliza pasarelas de pago certificadas internacionalmente. Tu información financiera está encriptada y nosotros nunca tenemos acceso a los datos de tu tarjeta de crédito o débito.</p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-black text-black uppercase tracking-widest">¿Cuánto tiempo tarda en llegar mi pedido?</h2>
                        <p>Trabajamos bajo un modelo de confección bajo demanda (Print on Demand) para asegurar la máxima calidad. Desde que haces tu compra hasta que llega a la puerta de tu casa en México, el tiempo estimado es de <strong className="text-black">7 a 10 días hábiles</strong>.</p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-black text-black uppercase tracking-widest">¿Cómo sé qué talla elegir?</h2>
                        <p>Al no contar con cambios por errores de talla, es fundamental que elijas correctamente. En la página de cada producto encontrarás una <strong>Guía de Tallas</strong> con las medidas exactas en centímetros. Te recomendamos medir una prenda que te quede bien y compararla con nuestra tabla.</p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-black text-black uppercase tracking-widest">¿Qué hago si mi prenda llega con un defecto?</h2>
                        <p>Respaldamos la calidad de nuestro Archivo. Si recibes una pieza con un error de impresión o daño de fábrica, envíanos un correo a <a href="mailto:omerta2104@gmail.com" className="text-black font-bold underline">omerta2104@gmail.com</a> con fotos del problema dentro de los primeros 30 días y te enviaremos un reemplazo sin costo extra.</p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-black text-black uppercase tracking-widest">¿Puedo rastrear mi pedido?</h2>
                        <p>Sí. Una vez que tu pieza sea empaquetada y entregada a la paquetería, te enviaremos un correo electrónico con tu número de guía y el enlace oficial para que sepas exactamente dónde está tu paquete.</p>
                    </div>

                    <div className="space-y-4 border-t border-gray-200 pt-8 mt-12">
                        <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
                            ¿Aún tienes dudas? <Link href="/contacto" className="text-black hover:underline">Contáctanos aquí.</Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}