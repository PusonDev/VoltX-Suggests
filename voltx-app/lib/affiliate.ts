import type { Product } from "./firebase/types";

/**
 * Single resolver for merchant URLs.
 * According to Master Spec v2:
 * resolveMerchantUrl(product) returns affiliate_url ONLY when affiliate_status === 'approved'.
 * There is no direct_url fallback for public display anymore.
 */
export function resolveMerchantUrl(product: Product): string {
  if (
    product.affiliate_status === "approved" &&
    product.affiliate_url &&
    product.affiliate_url.trim() !== ""
  ) {
    return product.affiliate_url;
  }
  return "#";
}

/**
 * Check if a product is approved and affiliate-ready
 */
export function isAffiliate(product: Product): boolean {
  return (
    product.affiliate_status === "approved" &&
    product.affiliate_url !== null &&
    product.affiliate_url.trim() !== ""
  );
}
