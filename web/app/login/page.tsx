"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(false); // Empezamos en "Unirse" para el hype
    const [email, setEmail] = useState('');
    const [enviado, setEnviado] = useState(false);

    const manejarRegistro = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí se conectaría con tu base de datos o lista de correos
        setEnviado(true);
    };

    return (
        <div className="min-h-screen bg-[#e5e5e5] flex flex-col font-sans selection:bg-black selection:text-white relative overflow-hidden">

            {/* Fondo tipográfico */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-5">
            </div>

            {/* ENCABEZADO */}
            <header className="p-6 relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
                    <ArrowLeft size={16} /> Volver a la base
                </Link>
            </header>

            {/* CUERPO PRINCIPAL */}
            <main className="flex-1 flex items-center justify-center p-4 relative z-10">
                <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-200 flex flex-col items-center">

                    {/* Logo y Subtítulo */}
                    <div className="text-center mb-10 w-full">
                        <h2 className="text-3xl font-black tracking-[0.3em] uppercase mb-2 text-black">OMERTA</h2>
                        <p className="text-[10px] font-mono text-gray-400 tracking-widest uppercase relative h-4">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={enviado ? 'confirmado' : (isLogin ? 'acceso' : 'solicitud')}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className='absolute inset-0'
                                >
                                    {enviado ? 'Registro Completado' : (isLogin ? 'Acceso Autorizado' : 'Registro')}
                                </motion.span>
                            </AnimatePresence>
                        </p>
                    </div>

                    {!enviado ? (
                        <>
                            {/* Interruptor de Modo */}
                            <div className="flex bg-gray-100 p-1 rounded-full mb-8 relative w-full">
                                <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest z-10 transition-colors ${isLogin ? 'text-white' : 'text-gray-500'}`}>
                                    Entrar
                                </button>
                                <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest z-10 transition-colors ${!isLogin ? 'text-white' : 'text-gray-500'}`}>
                                    Unirse
                                </button>
                                <motion.div className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-black rounded-full z-0" animate={{ left: isLogin ? '4px' : 'calc(50%)' }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                            </div>

                            {/* FORMULARIO */}
                            <form className="w-full flex flex-col gap-4" onSubmit={manejarRegistro}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={isLogin ? 'login' : 'register'}
                                        initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex flex-col gap-4"
                                    >
                                        {!isLogin && (
                                            <div className="relative">
                                                {/* CAMBIO: text-gray-600 para más contraste */}
                                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                                {/* CAMBIO: bg-gray-100/50 y placeholder:text-gray-600 */}
                                                <input type="text" placeholder="Nombre y apellidos" className="w-full bg-gray-100/50 border border-gray-200 text-sm px-11 py-3.5 rounded-xl font-mono focus:border-black placeholder:text-gray-600 text-black outline-none transition-all" />
                                            </div>
                                        )}
                                        <div className="relative">
                                            {/* CAMBIO: text-gray-600 para más contraste */}
                                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                            {/* CAMBIO: bg-gray-100/50 y placeholder:text-gray-600 */}
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Correo oficial"
                                                className="w-full bg-gray-100/50 border border-gray-200 text-sm px-11 py-3.5 rounded-xl font-mono focus:border-black placeholder:text-gray-600 text-black outline-none transition-all"
                                            />
                                        </div>
                                        <div className="relative">
                                            {/* CAMBIO: text-gray-600 para más contraste */}
                                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                            {/* CAMBIO: bg-gray-100/50 y placeholder:text-gray-600 */}
                                            <input type="password" placeholder="Crea una Contraseña" className="w-full bg-gray-100/50 border border-gray-200 text-sm px-11 py-3.5 rounded-xl font-mono focus:border-black placeholder:text-gray-600 text-black outline-none transition-all" />
                                        </div>
                                        {isLogin && (
                                            <div className="text-right">
                                                <a href="#" className="text-[10px] font-mono text-gray-500 hover:text-black uppercase tracking-wider">¿Olvidaste tu llave?</a>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                <button type="submit" className="w-full bg-black text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl transition-all flex items-center justify-center gap-2 group mt-6 active:scale-95 shadow-lg">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={isLogin ? 'acceder' : 'forjar'}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className='flex items-center gap-2'
                                        >
                                            {isLogin ? 'Acceder al Archivo' : 'Forjar Alianza'}
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </motion.span>
                                    </AnimatePresence>
                                </button>
                            </form>
                        </>
                    ) : (
                        /* ESTADO DE ÉXITO POST-REGISTRO (YA ESTÁ AL 100%) */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full text-center py-10"
                        >
                            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck size={32} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4 text-black">Protocolo Activado</h3>
                            <p className="text-xs text-gray-500 font-mono leading-relaxed uppercase tracking-widest px-4">
                                Tu correo ha sido encriptado en nuestra base. <br /> Serás notificado cuando el archivo sea liberado.
                            </p>
                            <button
                                onClick={() => {
                                    setEnviado(false);
                                    setEmail('');
                                }}
                                className="mt-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors"
                            >
                                Volver al formulario
                            </button>
                        </motion.div>
                    )}

                </div>
            </main>
        </div>
    );
}