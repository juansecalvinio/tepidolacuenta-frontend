import { Header } from "../components/Header";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="h-[90%]">
        <Outlet />
      </main>
    </>
  );
};
