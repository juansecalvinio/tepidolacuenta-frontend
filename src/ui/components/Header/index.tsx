import { ToggleTheme } from "../ToggleTheme";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full border-b border-neutral-100">
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold tracking-tighter">
          tepidolacuenta
        </h1>
        <div className="flex items-center gap-4">
          <ToggleTheme />
          <button className="btn btn-soft">Sign in</button>
        </div>
      </div>
    </header>
  );
};
