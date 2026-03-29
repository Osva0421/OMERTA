import { create } from 'zustand';

interface Prenda {
    id: string | number;
    shopifyId?: string;
    name: string;
    price?: string;
    precio?: string;
    img: string;
    cantidad?: number;
    rawPrice?: number;
    [key: string]: any;
}

interface CartStore {
    carrito: Prenda[];
    favoritos: Prenda[];
    agregarPrenda: (prenda: Prenda) => void;
    eliminarPrenda: (index: number) => void;
    actualizarCantidad: (index: number, delta: number) => void;
    toggleFavorito: (prenda: Prenda) => void;
    agregarFavorito: (prenda: Prenda) => void;
    quitarFavorito: (shopifyId: string) => void;
    obtenerTotalCarrito: () => number; // <-- NUEVO: Función para darte el total en MXN
}

export const useCartStore = create<CartStore>((set, get) => ({
    carrito: [],
    favoritos: [],

    // --- NUEVO: CÁLCULO CENTRALIZADO DEL TOTAL ---
    obtenerTotalCarrito: () => {
        const { carrito } = get();
        return carrito.reduce((total, item) => {
            // Multiplica el rawPrice por la cantidad. Si no hay rawPrice, suma 0.
            return total + ((item.rawPrice || 0) * (item.cantidad || 1));
        }, 0);
    },

    // --- LÓGICA DEL CARRITO ---
    agregarPrenda: (prenda) => set((state) => {
        // FIX: Ahora buscamos por el ID EXACTO de la talla (shopifyId)
        const existe = state.carrito.findIndex(p => p.shopifyId === prenda.shopifyId);
        if (existe >= 0) {
            const nuevoCarrito = [...state.carrito];
            nuevoCarrito[existe].cantidad = (nuevoCarrito[existe].cantidad || 1) + 1;
            return { carrito: nuevoCarrito };
        }
        return { carrito: [...state.carrito, { ...prenda, cantidad: 1 }] };
    }),

    eliminarPrenda: (index) => set((state) => ({
        carrito: state.carrito.filter((_, i) => i !== index)
    })),

    actualizarCantidad: (index, delta) => set((state) => {
        const nuevoCarrito = [...state.carrito];
        const cantidadActual = nuevoCarrito[index].cantidad || 1;
        const nuevaCantidad = Math.max(0, cantidadActual + delta);

        if (nuevaCantidad === 0) {
            return { carrito: state.carrito.filter((_, i) => i !== index) };
        }
        nuevoCarrito[index].cantidad = nuevaCantidad;
        return { carrito: nuevoCarrito };
    }),

    // --- LÓGICA DEL CLÓSET (FAVORITOS) ---
    toggleFavorito: (prenda) => set((state) => {
        // FIX: Diferenciamos tallas en el clóset también
        const existe = state.favoritos.some(f => f.shopifyId === prenda.shopifyId);
        if (existe) {
            return { favoritos: state.favoritos.filter(f => f.shopifyId !== prenda.shopifyId) };
        }
        return { favoritos: [...state.favoritos, { ...prenda, cantidad: 1 }] };
    }),

    agregarFavorito: (prenda) => set((state) => {
        const existe = state.favoritos.some(f => f.shopifyId === prenda.shopifyId);
        if (!existe) {
            return { favoritos: [...state.favoritos, { ...prenda, cantidad: 1 }] };
        }
        return state;
    }),

    quitarFavorito: (shopifyId) => set((state) => ({
        favoritos: state.favoritos.filter(f => f.shopifyId !== shopifyId)
    }))
}));