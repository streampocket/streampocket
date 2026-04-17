export function isAaProduct(productName: string): boolean {
  return / AA$/i.test(productName.trim())
}
