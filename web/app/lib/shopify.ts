// app/lib/shopify.ts

const rawDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const cleanDomain = rawDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

export async function ShopifyData(query: string, variables = {}) {
  const endpoint = `https://${cleanDomain}/api/2024-01/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });

    // FIX MÁGICO: Leemos como texto primero para evitar que la pantalla explote
    const text = await result.text();

    try {
      return JSON.parse(text); // Intentamos convertirlo a datos
    } catch (e) {
      // Si explota, es porque Shopify mandó HTML (un error)
      console.error("ALERTA: Shopify no devolvió JSON. Revisa tus llaves.");
      console.error("Endpoint intentado:", endpoint);
      console.error("Respuesta real de Shopify:", text.substring(0, 200) + "...");
      return { data: null };
    }

  } catch (error) {
    console.error("Error en conexión física:", error);
    return { data: null };
  }
}

// 1. OBTENER TODO EL ARSENAL (Para el Inicio)
export async function getProducts() {
  // FIX: Ordenamos por fecha de creación y extraemos los 'tags' para poder separar por género
  const query = `{
    products(first: 20, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          title
          handle
          tags
          priceRange { minVariantPrice { amount } }
          images(first: 1) { edges { node { url } } }
          variants(first: 1) {
            edges { node { id } }
          }
        }
      }
    }
  }`;
  const response = await ShopifyData(query);
  return response?.data?.products?.edges || [];
}

// 2. OBTENER POR COLECCIÓN (Para los filtros)
export async function getProductsByCollection(handle: string) {
  const query = `
    query getProductsByCollection($handle: String!) {
      collection(handle: $handle) {
        products(first: 20) {
          edges {
            node {
              id
              title
              handle
              priceRange { minVariantPrice { amount } }
              images(first: 1) { edges { node { url } } }
              variants(first: 1) {
                edges { node { id } }
              }
            }
          }
        }
      }
    }
  `;
  try {
    const response = await ShopifyData(query, { handle });
    return response?.data?.collection?.products?.edges || [];
  } catch (error) {
    console.error("Error al filtrar por colección:", error);
    return [];
  }
}

// 3. CREAR EL CHECKOUT (Para cobrar)
export async function crearCheckout(carrito: any[]) {
  const lines = carrito
    .filter(item => item.shopifyId && item.shopifyId !== "ID_VACIO")
    .map((item) => ({
      merchandiseId: item.shopifyId,
      quantity: item.cantidad || 1,
    }));

  if (lines.length === 0) return null;

  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { checkoutUrl }
        userErrors { message field }
      }
    }
  `;

  try {
    const json = await ShopifyData(query, { input: { lines } });
    if (json?.errors) return null;
    const cart = json?.data?.cartCreate?.cart;
    return cart?.checkoutUrl || null;
  } catch (error) {
    return null;
  }
}

// 4. OBTENER PRODUCTO INDIVIDUAL
export async function getProduct(handle: string) {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        description
        priceRange { minVariantPrice { amount } }
        images(first: 5) { edges { node { url } } }
        variants(first: 10) { 
          edges { 
            node { 
              id 
              title 
              availableForSale 
              price { amount } 
            } 
          } 
        }
      }
    }
  `;
  try {
    const response = await ShopifyData(query, { handle });
    return response?.data?.product || null;
  } catch (error) {
    return null;
  }
}