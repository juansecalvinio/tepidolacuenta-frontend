import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  description: string;
}

export const PlanLimitReached = ({ title, description }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 gap-6">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-warning/20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 text-warning"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold mb-2">{title}</h2>
        <p className="text-fg-soft text-sm max-w-xs">{description}</p>
      </div>

      <button
        className="btn btn-primary"
        onClick={() => navigate("/dashboard/plans")}
      >
        Ver planes disponibles
      </button>
    </div>
  );
};
