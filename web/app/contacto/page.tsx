import Link from 'next/link';
import { ArrowLeft, Mail, Instagram } from 'lucide-react';

export default function ContactoPage() {
    return (
        <div className="min-h-screen bg-[#fcfcfc] text-black font-sans selection:bg-black selection:text-white">
            <div className="max-w-3xl mx-auto px-6 py-20 md:py-32">

                <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] mb-12 hover:opacity-50 transition-opacity text-gray-500">
                    <ArrowLeft size={14} /> Volver al Inicio
                </Link>

                <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-16">
                    Soporte <br /><span className="text-gray-400">Oficial</span>
                </h1>

                <div className="space-y-12 text-sm md:text-base leading-relaxed text-gray-600">
                    <p>Para dudas sobre el archivo, seguimiento de tu orden, problemas con tu pedido o colaboraciones, nuestro equipo está a tu disposición.</p>

                    <div className="flex flex-col gap-6 mt-8">
                        <a href="mailto:omerta2104@gmail.com" className="flex items-center gap-4 p-6 border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all rounded-2xl group">
                            <Mail size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                            <div>
                                <h3 className="font-black uppercase tracking-widest text-xs mb-1">Correo Electrónico</h3>
                                <p className="font-mono text-sm">omerta2104@gmail.com</p>
                            </div>
                        </a>

                        <a href="https://www.instagram.com/omerta.wrld?igsh=NGNhaXRsNjVkdzN4&utm_source=qr" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-6 border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all rounded-2xl group">
                            <Instagram size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                            <div>
                                <h3 className="font-black uppercase tracking-widest text-xs mb-1">Mensaje Directo (IG)</h3>
                                <p className="font-mono text-sm">@omerta.wrld</p>
                            </div>
                        </a>
                    </div>

                    <p className="text-xs uppercase tracking-widest font-bold mt-12 text-gray-400">
                        Tiempo estimado de respuesta: Máximo 24 horas.
                    </p>
                </div>
            </div>
        </div>
    );
}