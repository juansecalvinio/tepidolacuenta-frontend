export class PriceUtils {
  static getFormattedPrice(amount: number): string {
    return amount.toLocaleString("es-AR");
  }
}
