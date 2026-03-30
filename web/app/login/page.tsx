"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Mail, User, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(false);
    const [verPassword, setVerPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [enviado, setEnviado] = useState(false);

    const manejarRegistro = (e: React.FormEvent) => {
        e.preventDefault();
        // Por ahora es visual, luego lo conectamos a tu base de datos real
        setEnviado(true);
    };

    return (
        <div className="min-h-screen bg-[#e5e5e5] flex flex-col font-sans selection:bg-black selection:text-white relative overflow-hidden">

            {/* Fondo tipográfico */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-5">
                <h1 className="text-[15vw] font-black tracking-tighter leading-none text-black text-center">OMERTA<br /></h1>
            </div>

            <header className="p-6 relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
                    <ArrowLeft size={16} /> Volver a la base
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 relative z-10">
                <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-200 flex flex-col items-center">

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
                                    {enviado ? 'Acceso Concedido' : (isLogin ? 'Puerta de Enlace' : 'Registro de Miembro')}
                                </motion.span>
                            </AnimatePresence>
                        </p>
                    </div>

                    {!enviado ? (
                        <>
                            <div className="flex bg-gray-100 p-1 rounded-full mb-8 relative w-full">
                                <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest z-10 transition-colors ${isLogin ? 'text-white' : 'text-gray-500'}`}>
                                    Entrar
                                </button>
                                <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest z-10 transition-colors ${!isLogin ? 'text-white' : 'text-gray-500'}`}>
                                    Unirse
                                </button>
                                <motion.div className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-black rounded-full z-0" animate={{ left: isLogin ? '4px' : 'calc(50%)' }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                            </div>

                            <form className="w-full flex flex-col gap-4" onSubmit={manejarRegistro}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={isLogin ? 'login' : 'register'}
                                        initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                                        className="flex flex-col gap-4"
                                    >
                                        {!isLogin && (
                                            <div className="relative">
                                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                                <input type="text" placeholder="Tu nombre o alias" className="w-full bg-gray-100/50 border border-gray-200 text-sm px-11 py-3.5 rounded-xl font-mono focus:border-black placeholder:text-gray-600 text-black outline-none transition-all" />
                                            </div>
                                        )}
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Correo electrónico"
                                                className="w-full bg-gray-100/50 border border-gray-200 text-sm px-11 py-3.5 rounded-xl font-mono focus:border-black placeholder:text-gray-600 text-black outline-none transition-all"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                            <input
                                                type={verPassword ? "text" : "password"}
                                                placeholder="Contraseña"
                                                className="w-full bg-gray-100/50 border border-gray-200 text-sm px-11 pr-12 py-3.5 rounded-xl font-mono focus:border-black placeholder:text-gray-600 text-black outline-none transition-all"
                                            />
                                            {/* BOTÓN PARA VER CONTRASEÑA */}
                                            <button
                                                type="button"
                                                onClick={() => setVerPassword(!verPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                                            >
                                                {verPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
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
                                            {isLogin ? 'Entrar' : 'Registrarme'}
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </motion.span>
                                    </AnimatePresence>
                                </button>
                            </form>
                        </>
                    ) : (
                        /* ESTADO DE ÉXITO SIMPLIFICADO */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full text-center py-10"
                        >
                            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={32} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4 text-black">¡Bienvenido a la Alianza! </h3>
                            <p className="text-xs text-gray-500 font-mono leading-relaxed uppercase tracking-widest px-4">
                                ¡Gracias por elegirnos! Esta sección AÚN se esta trabajando... Puedes comprar sin problema <br /> Prepárate para el próximo drop.
                            </p>
                            <Link
                                href="/"
                                className="inline-block mt-10 bg-gray-100 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-black hover:bg-black hover:text-white transition-all"
                            >
                                Ir a la tienda
                            </Link>
                        </motion.div>
                    )}

                </div>
            </main>
        </div>
    );
}