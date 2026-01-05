import QRCode from "react-qr-code";

interface Props {
  tableNumber: number;
  qrCode: string;
}

export const TableQR = ({ tableNumber, qrCode }: Props) => {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body p-4 flex flex-col items-center justify-between">
        <div className="text-xl font-bold text-base-content/60">
          Mesa {tableNumber}
        </div>
        <QRCode value={qrCode} size={150} />
      </div>
    </div>
  );
};
