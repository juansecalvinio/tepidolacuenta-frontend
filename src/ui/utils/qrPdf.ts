import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export interface QrTable {
  id: string;
  number: number;
  qrCode: string;
}

export type QrLayout = "grid" | "page";

const PAGE = { w: 210, h: 297, margin: 12 }; // A4 en mm

const drawCard = (
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  table: QrTable,
  qrDataUrl: string,
  large: boolean,
) => {
  // Borde punteado = guía de corte
  doc.setDrawColor(190);
  doc.setLineWidth(0.2);
  doc.setLineDashPattern([1, 1], 0);
  doc.roundedRect(x + 2, y + 2, w - 4, h - 4, 2, 2);
  doc.setLineDashPattern([], 0);

  const cx = x + w / 2;
  const qs = large ? Math.min(w - 40, 120) : Math.min(w - 18, 46);

  let cursorY = y + (large ? 30 : 13);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(large ? 20 : 11);
  doc.setTextColor(23);
  doc.text("tepidolacuenta", cx, cursorY, { align: "center" });

  cursorY += large ? 12 : 5;
  doc.addImage(qrDataUrl, "PNG", cx - qs / 2, cursorY, qs, qs);
  cursorY += qs + (large ? 16 : 8);

  doc.setFontSize(large ? 26 : 15);
  doc.setTextColor(23);
  doc.text(`Mesa ${table.number}`, cx, cursorY, { align: "center" });

  cursorY += large ? 9 : 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(large ? 12 : 8);
  doc.setTextColor(120);
  doc.text("Escaneá para pedir la cuenta", cx, cursorY, { align: "center" });
};

export const generateQrPdf = async (
  tables: QrTable[],
  layout: QrLayout,
  headerText?: string,
) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // QR en alta resolución (PNG) para que escaneen e impriman nítidos.
  const items = await Promise.all(
    tables.map(async (table) => ({
      table,
      qr: await QRCode.toDataURL(table.qrCode, { width: 600, margin: 0 }),
    })),
  );

  const drawHeader = (): number => {
    if (!headerText) return PAGE.margin;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(130);
    doc.text(headerText, PAGE.margin, PAGE.margin);
    return PAGE.margin + 6;
  };

  if (layout === "page") {
    items.forEach(({ table, qr }, i) => {
      if (i > 0) doc.addPage();
      const top = drawHeader();
      drawCard(
        doc,
        PAGE.margin,
        top,
        PAGE.w - PAGE.margin * 2,
        PAGE.h - top - PAGE.margin,
        table,
        qr,
        true,
      );
    });
  } else {
    const cols = 2;
    const rows = 3;
    const perPage = cols * rows;
    const pageCount = Math.max(1, Math.ceil(items.length / perPage));

    for (let p = 0; p < pageCount; p++) {
      if (p > 0) doc.addPage();
      const top = drawHeader();
      const cellW = (PAGE.w - PAGE.margin * 2) / cols;
      const cellH = (PAGE.h - top - PAGE.margin) / rows;

      for (let k = 0; k < perPage; k++) {
        const item = items[p * perPage + k];
        if (!item) break;
        const col = k % cols;
        const row = Math.floor(k / cols);
        drawCard(
          doc,
          PAGE.margin + col * cellW,
          top + row * cellH,
          cellW,
          cellH,
          item.table,
          item.qr,
          false,
        );
      }
    }
  }

  doc.save("qrs-tepidolacuenta.pdf");
};
