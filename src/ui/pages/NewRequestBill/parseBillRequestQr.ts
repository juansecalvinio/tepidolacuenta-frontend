export interface BillRequestQrParams {
  restaurantId: string;
  branchId: string;
  tableId: string;
  tableNumber: number;
  hash: string;
}

/**
 * Parsea los datos del QR de la mesa desde el query string.
 *
 * El backend serializa el target del QR escapando "&" como la secuencia
 * literal "&", por lo que normalizamos eso antes de parsear. Devuelve
 * `null` si falta algún campo o si el número de mesa no es válido.
 */
export const parseBillRequestQr = (
  search: string,
): BillRequestQrParams | null => {
  const raw = search.replace(/^\?/, "").replace(/\\u0026/g, "&");
  const params = new URLSearchParams(raw);

  const restaurantId = params.get("r");
  const branchId = params.get("b");
  const tableId = params.get("t");
  const tableNumberRaw = params.get("n");
  const hash = params.get("h");

  if (!restaurantId || !branchId || !tableId || !tableNumberRaw || !hash) {
    return null;
  }

  const tableNumber = Number.parseInt(tableNumberRaw, 10);
  if (Number.isNaN(tableNumber)) {
    return null;
  }

  return { restaurantId, branchId, tableId, tableNumber, hash };
};
