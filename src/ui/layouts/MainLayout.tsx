import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <main className="h-full bg-base-200">
      <div className="max-w-3xl mx-auto relative">
        <Header />
        <div className="pb-20 md:pb-0">
          <Outlet />
        </div>
      </div>
      <BottomNav />
    </main>
  );
};
