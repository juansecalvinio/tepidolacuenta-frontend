import { useEffect, useRef } from "react";
import QRCode from "react-qr-code";

interface Props {
  title: string;
  qrCode: string;
  show?: boolean;
  onClose?: () => void;
}

export const QRModal = ({ title, qrCode, show, onClose }: Props) => {
  const ref = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    if (ref.current) {
      ref.current.showModal();
    }
  };

  const closeModal = () => {
    if (ref.current) {
      ref.current.close();
    }
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    if (show) {
      openModal();
    }
  }, [show]);

  return (
    <dialog ref={ref} id="custom_modal" className="modal">
      <div className="modal-box p-8">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={closeModal}
          >
            ✕
          </button>
        </form>
        <h3 className="font-display text-3xl font-semibold text-center mb-4">{title}</h3>
        <div className="flex justify-center">
          <QRCode value={qrCode} size={300} />
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeModal}>close</button>
      </form>
    </dialog>
  );
};
