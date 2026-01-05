import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableQR } from "../../../components/TableQR";
import { useTables } from "../../../hooks/useTables";

export const Tables = () => {
  const navigate = useNavigate();
  const { tables } = useTables();
  const [filteredTables, setFilteredTables] = useState(tables);

  const handleSearchField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = tables.filter((table) =>
      table.number.toString().includes(searchTerm)
    );
    setFilteredTables(filtered);
  };

  return (
    <div className="p-4 md:p-2 max-w-4xl mx-auto">
      <div className="mb-4 flex flex-col md:flex-row justify-between md:items-center gap-2">
        <div className="flex flex-col gap-2">
          <button
            className="btn btn-soft btn-sm w-fit mb-4"
            onClick={() => navigate("/dashboard")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Dashboard
          </button>
          <h2 className="text-xl md:text-2xl font-bold">
            Estos son los QRs de las tus mesas
          </h2>
          <p className="text-sm md:text-md">
            Podés imprimirlos para que cada cliente pueda pedir su cuenta
          </p>
        </div>
        <label className="input">
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
            placeholder="Buscar número de mesa"
            onChange={handleSearchField}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredTables.length > 0 &&
          filteredTables.map((table) => (
            <TableQR tableNumber={table.number} qrCode={table.qrCode} />
          ))}
      </div>
    </div>
  );
};
