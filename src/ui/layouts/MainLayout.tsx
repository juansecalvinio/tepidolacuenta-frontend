import { Header } from "../components/Header";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <main className="h-full bg-base-200">
      <div className="max-w-2xl mx-auto relative">
        <Header />
        <Outlet />
      </div>
    </main>
  );
};
