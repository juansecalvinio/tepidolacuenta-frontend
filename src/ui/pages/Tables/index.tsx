import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { TableQR } from "../../components/TableQR";
import { useTables } from "../../hooks/useTables";
import { QRModal } from "../../components/QRModal";
import { TablesMenu } from "../../components/TablesMenu";
import { useFetchTables } from "../../hooks/useFetchTables";

const ITEMS_PER_PAGE = 6;

export const Tables = () => {
  const { fetchTables } = useFetchTables();
  const { tables, isLoading } = useTables();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalTableNumber, setModalTableNumber] = useState<number | null>(null);
  const [modalTableQRCode, setModalTableQRCode] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTables = tables.filter((table) =>
    table.number.toString().includes(searchTerm),
  );
  const totalPages = Math.ceil(filteredTables.length / ITEMS_PER_PAGE);
  const paginatedTables = filteredTables.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSearchField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleQRClick = (tableNumber: number, qrCode: string) => {
    setModalTableNumber(tableNumber);
    setModalTableQRCode(qrCode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 max-w-3xl mx-auto space-y-4 pt-6">
        <div className="h-8 w-40 bg-base-300 rounded-lg animate-pulse" />
        <div className="h-10 w-full bg-base-300 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-base-300 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Sección visible solo al imprimir */}
      <div className="hidden print:block">
        <div className="grid grid-cols-3 gap-6">
          {tables.map((table) => (
            <div
              key={table.qrCode}
              className="flex flex-col items-center gap-2 p-4 border border-gray-300 rounded"
            >
              <span className="text-base font-bold">Mesa {table.number}</span>
              <QRCode value={table.qrCode} size={130} />
            </div>
          ))}
        </div>
      </div>

      <div className="print:hidden">
        <QRModal
          show={isModalOpen}
          title={`Mesa ${modalTableNumber}`}
          qrCode={modalTableQRCode || ""}
          onClose={handleCloseModal}
        />

        {/* Header: título + menú */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold">QRs de las mesas</h2>
          <TablesMenu />
        </div>

        {/* Búsqueda: ancho completo en mobile */}
        <label className="input input-sm w-full mb-6">
          <svg
            className="h-4 w-4 opacity-50 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            className="grow"
            placeholder="Buscar mesa por número..."
            onChange={handleSearchField}
          />
        </label>

        {filteredTables.length === 0 ? (
          <div className="border border-base-300 rounded-xl bg-base-100">
            <div className="p-8 flex flex-col items-center gap-2 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-base-content/20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <p className="text-base-content/40 text-sm">
                No se encontraron mesas
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {paginatedTables.map((table) => (
              <TableQR
                key={table.qrCode}
                tableNumber={table.number}
                qrCode={table.qrCode}
                onClick={() => handleQRClick(table.number, table.qrCode)}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              ← Anterior
            </button>
            <span className="text-sm text-base-content/50">
              {currentPage} / {totalPages}
            </span>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
