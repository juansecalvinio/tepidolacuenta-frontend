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
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-base-200">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="font-light text-center">Estamos cargando tus mesas...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
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
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <h2 className="text-2xl font-bold">QRs de las mesas</h2>

          <div className="flex items-center gap-4">
            <label className="input input-md max-w-40">
              <svg
                className="h-[1em] opacity-50"
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
                placeholder="Buscar mesa"
                onChange={handleSearchField}
              />
            </label>

            <TablesMenu />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {paginatedTables.map((table) => (
            <TableQR
              key={table.qrCode}
              tableNumber={table.number}
              qrCode={table.qrCode}
              onClick={() => handleQRClick(table.number, table.qrCode)}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="join">
              <button
                className="join-item btn"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                «
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`join-item btn ${currentPage === page ? "btn-active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                className="join-item btn"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
      {/* fin print:hidden */}
    </div>
  );
};
