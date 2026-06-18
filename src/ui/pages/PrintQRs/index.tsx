import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTables } from "../../hooks/useTables";
import { useFetchTables } from "../../hooks/useFetchTables";
import { QRPrintCard } from "../../components/QRPrintCard";

type Layout = "grid" | "page";

export const PrintQRs = () => {
  const navigate = useNavigate();
  const { tables, isLoading } = useTables();
  const { fetchTables } = useFetchTables();
  const [layout, setLayout] = useState<Layout>("grid");

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const sorted = useMemo(
    () => [...tables].sort((a, b) => a.number - b.number),
    [tables],
  );

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Barra de herramientas — no se imprime */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between gap-3">
        <button
          onClick={() => navigate("/dashboard/tables")}
          className="btn btn-sm btn-ghost text-neutral-700"
        >
          ← Volver
        </button>

        <div className="flex items-center gap-2">
          <div className="join">
            <button
              className={`btn btn-sm join-item ${layout === "grid" ? "btn-primary" : "btn-ghost text-neutral-700"}`}
              onClick={() => setLayout("grid")}
            >
              Varias por hoja
            </button>
            <button
              className={`btn btn-sm join-item ${layout === "page" ? "btn-primary" : "btn-ghost text-neutral-700"}`}
              onClick={() => setLayout("page")}
            >
              Una por página
            </button>
          </div>
          <button
            className="btn btn-sm btn-primary"
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 print:gap-3 max-w-4xl mx-auto">
            {sorted.map((table) => (
              <QRPrintCard
                key={table.id}
                tableNumber={table.number}
                qrCode={table.qrCode}
              />
            ))}
          </div>
        ) : (
          <div>
            {sorted.map((table) => (
              <div
                key={table.id}
                className="flex items-center justify-center min-h-screen break-after-page"
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
