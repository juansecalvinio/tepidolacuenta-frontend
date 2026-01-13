import { Header } from "../components/Header";
import { NotificationContainer } from "../components/NotificationContainer";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="h-[90%] max-w-4xl mx-auto relative">
        <Outlet />
      </main>
      <NotificationContainer />
    </>
  );
};
