import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTables } from "../../hooks/useTables";
import { useFetchTables } from "../../hooks/useFetchTables";
import { useRestaurants } from "../../hooks/useRestaurants";
import { QRPrintCard } from "../../components/QRPrintCard";
import { generateQrPdf } from "../../utils/qrPdf";

type Layout = "grid" | "page";

export const PrintQRs = () => {
  const navigate = useNavigate();
  const { tables, isLoading } = useTables();
  const { fetchTables } = useFetchTables();
  const { restaurant, activeBranch } = useRestaurants();
  const [layout, setLayout] = useState<Layout>("grid");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const sorted = useMemo(
    () => [...tables].sort((a, b) => a.number - b.number),
    [tables],
  );

  const headerText = [restaurant?.name, activeBranch?.address]
    .filter(Boolean)
    .join(" · ");

  const handleDownloadPdf = async () => {
    if (sorted.length === 0) return;
    try {
      setIsGenerating(true);
      await generateQrPdf(
        sorted.map((t) => ({ id: t.id, number: t.number, qrCode: t.qrCode })),
        layout,
        headerText || undefined,
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Barra de herramientas — no se imprime */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between gap-3">
        <button
          onClick={() => navigate("/dashboard/tables")}
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md px-2.5 py-1.5 transition-colors"
        >
          ← Volver
        </button>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-neutral-300 overflow-hidden text-sm">
            <button
              className={`px-3 py-1.5 transition-colors ${
                layout === "grid"
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-100"
              }`}
              onClick={() => setLayout("grid")}
            >
              Varias por hoja
            </button>
            <button
              className={`px-3 py-1.5 border-l border-neutral-300 transition-colors ${
                layout === "page"
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-100"
              }`}
              onClick={() => setLayout("page")}
            >
              Una por página
            </button>
          </div>
          <button
            className="text-sm font-semibold rounded-lg px-4 py-1.5 border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={handleDownloadPdf}
            disabled={sorted.length === 0 || isGenerating}
          >
            {isGenerating ? "Generando…" : "Descargar PDF"}
          </button>
          <button
            className="text-sm font-semibold rounded-lg px-4 py-1.5 bg-primary text-primary-content hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => window.print()}
            disabled={sorted.length === 0}
          >
            Imprimir
          </button>
        </div>
      </div>

      <div className="p-6 print:p-0">
        {isLoading && sorted.length === 0 ? (
          <p className="text-center text-neutral-500 py-12">Cargando mesas…</p>
        ) : sorted.length === 0 ? (
          <p className="text-center text-neutral-500 py-12">
            No hay mesas en esta sucursal.
          </p>
        ) : layout === "grid" ? (
          <div className="max-w-4xl mx-auto">
            {headerText && (
              <p className="mb-4 print:mb-3 text-center text-sm text-neutral-500">
                {headerText}
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 print:grid-cols-2 gap-4 print:gap-3">
              {sorted.map((table) => (
                <QRPrintCard
                  key={table.id}
                  tableNumber={table.number}
                  qrCode={table.qrCode}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            {sorted.map((table) => (
              <div
                key={table.id}
                className="flex items-center justify-center min-h-screen [&:not(:last-child)]:break-after-page"
              >
                <QRPrintCard
                  tableNumber={table.number}
                  qrCode={table.qrCode}
                  large
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
