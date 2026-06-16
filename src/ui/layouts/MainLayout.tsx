import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { SubscriptionGuard } from "../components/SubscriptionGuard";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <main className="min-h-screen bg-base-200">
      <div className="max-w-3xl mx-auto relative">
        <Header />
        <div className="pb-20">
          <SubscriptionGuard>
            <Outlet />
          </SubscriptionGuard>
        </div>
      </div>
      <BottomNav />
    </main>
  );
};
