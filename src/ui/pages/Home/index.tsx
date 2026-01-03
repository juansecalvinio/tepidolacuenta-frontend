import { useState } from "react";

const Spinner = () => (
  <div
    className="
    flex
    items-center
    justify-center
      w-8 h-8
      border-4 border-white/30
      border-t-white
      rounded-full
      animate-spin
    "
  />
);

export const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Simulate an async action
    setTimeout(() => {
      setIsRequested(true);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="h-full flex items-center justify-center">
      <button
        onClick={handleClick}
        className="
        flex items-center justify-center
        w-50 h-50
        rounded-full
        bg-linear-to-br from-green-500 to-green-700
        text-white text-4xl font-extrabold
        ring-4 ring-green-900/70
        shadow-[0_0_25px_rgba(34,197,94,0.5)]
        active:shadow-[0_4px_0_#14532d]
        active:translate-y-1
        transition-all
        "
      >
        {!isLoading && !isRequested && "Pedir la cuenta"}
        {isLoading && <Spinner />}
        {!isLoading && isRequested && "Cuenta pedida"}
      </button>
    </div>
  );
};
