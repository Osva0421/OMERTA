"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Mail, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen bg-[#e5e5e5] flex flex-col font-sans selection:bg-black selection:text-white relative overflow-hidden">

            {/* Fondo tipográfico */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-5">
                <h1 className="text-[15vw] font-black tracking-tighter leading-none text-black">SINDICATO</h1>
            </div>

            {/* ENCABEZADO */}
            <header className="p-6 relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
                    <ArrowLeft size={16} /> Volver a la base
                </Link>
            </header>

            {/* CUERPO PRINCIPAL */}
            <main className="flex-1 flex items-center justify-center p-4 relative z-10">
                {/* TARJETA BLANCA (Nuestra "Bóveda") */}
                <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-200 flex flex-col items-center">

                    {/* Logo y Subtítulo */}
                    <div className="text-center mb-10 w-full">
                        <h2 className="text-3xl font-black tracking-[0.3em] uppercase mb-2">OMERTA</h2>
                        <p className="text-[10px] font-mono text-gray-400 tracking-widest uppercase relative h-4">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={isLogin ? 'acceso' : 'solicitud'}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className='absolute inset-0'
                                >
                                    {isLogin ? 'Acceso Autorizado' : 'Solicitud de Ingreso'}
                                </motion.span>
                            </AnimatePresence>
                        </p>
                    </div>

                    {/* Interruptor de Modo */}
                    <div className="flex bg-gray-100 p-1 rounded-full mb-8 relative w-full">
                        <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest z-10 ${isLogin ? 'text-white' : 'text-gray-500'}`}>
                            Entrar
                        </button>
                        <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest z-10 ${!isLogin ? 'text-white' : 'text-gray-500'}`}>
                            Unirse
                        </button>
                        <motion.div className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-black rounded-full z-0" animate={{ left: isLogin ? '4px' : 'calc(50%)' }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                    </div>

                    {/* FORMULARIO */}
                    <div className="relative min-h-[220px] w-full">
                        <AnimatePresence mode="wait">
                            <motion.form key={isLogin ? 'login' : 'register'} initial={{ opacity: 0, x: isLogin ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isLogin ? 20 : -20 }} transition={{ duration: 0.3 }} className="absolute inset-0 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                                {!isLogin && (
                                    <div className="relative">
                                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" placeholder="Nombre en código" className="w-full bg-gray-50 border border-gray-200 text-sm px-11 py-3.5 rounded-xl font-mono" />
                                    </div>
                                )}
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="email" placeholder="Correo electrónico" className="w-full bg-gray-50 border border-gray-200 text-sm px-11 py-3.5 rounded-xl font-mono" />
                                </div>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="password" placeholder="Contraseña" className="w-full bg-gray-50 border border-gray-200 text-sm px-11 py-3.5 rounded-xl font-mono" />
                                </div>
                                {isLogin && (
                                    <div className="text-right">
                                        <a href="#" className="text-[10px] font-mono text-gray-500 hover:text-black uppercase tracking-wider">¿Perdiste tu llave?</a>
                                    </div>
                                )}
                            </motion.form>
                        </AnimatePresence>
                    </div>

                    {/* BOTÓN DE ACCIÓN (¡Mover aquí, dentro de la tarjeta!) */}
                    <button className={`w-full bg-black text-white font-bold uppercase tracking-[0.2em] py-4 rounded-xl transition-colors flex items-center justify-center gap-2 group ${isLogin ? 'mt-0' : 'mt-10'}`}>
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={isLogin ? 'acceder' : 'forjar'}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className='flex items-center gap-2'
                            >
                                {isLogin ? 'Acceder' : 'Forjar Alianza'}
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </motion.span>
                        </AnimatePresence>
                    </button>

                </div>
            </main>

        </div>
    );
}