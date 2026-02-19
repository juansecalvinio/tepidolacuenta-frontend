import QRCode from "react-qr-code";

interface Props {
  tableNumber: number;
  qrCode: string;
  onClick: () => void;
}

export const TableQR = ({ tableNumber, qrCode, onClick }: Props) => {
  return (
    <div
      className="card bg-base-100 border-2 border-base-300"
      onClick={onClick}
    >
      <div className="card-body p-4 flex flex-col items-center justify-between">
        <div className="text-xl font-bold">Mesa {tableNumber}</div>
        <QRCode value={qrCode} size={150} />
      </div>
    </div>
  );
};
