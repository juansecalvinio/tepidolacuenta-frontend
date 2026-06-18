import type { ReactNode } from "react";
import { AlertCircleIcon } from "../icons";

type AlertVariant = "error" | "success" | "warning" | "info";

interface Props {
  variant?: AlertVariant;
  className?: string;
  children: ReactNode;
}

export const Alert = ({ variant = "error", className = "", children }: Props) => (
  <div className={`alert alert-soft alert-${variant} ${className}`} role="alert">
    <AlertCircleIcon className="stroke-current shrink-0 h-6 w-6" />
    <span>{children}</span>
  </div>
);
