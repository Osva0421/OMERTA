"use server";

import { ShopifyData } from '@/app/lib/shopify';
import { redirect } from "next/navigation";

export async function checkout(variantId: string) {
  const query = `
    mutation {
      cartCreate(
        input: {
          lines: [
            {
              quantity: 1
              merchandiseId: "${variantId}"
            }
          ]
        }
      ) {
        cart {
          checkoutUrl
        }
      }
    }
  `;

  const response = await ShopifyData(query);
  const url = response.data?.cartCreate?.cart?.checkoutUrl;

  if (url) {
    redirect(url);
  }
}