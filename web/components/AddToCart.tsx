"use client";

import { useState } from "react";
import { checkout } from "@/app/actions"; // Importamos la función que creamos en el paso 1

export default function AddToCart({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);

    const handleBuy = async () => {
        setLoading(true);
        // Llamamos a la función del servidor que nos lleva a Shopify
        await checkout(id);
        // No hace falta setLoading(false) porque nos iremos de la página
    };

    return (
        <button
            onClick={handleBuy}
            disabled={loading}
            className={`w-full font-bold uppercase tracking-widest py-4 transition-all ${loading
                    ? "bg-gray-600 cursor-not-allowed text-gray-300"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
        >
            {loading ? "Redirigiendo a Shopify..." : "Comprar Ahora"}
        </button>
    );
}