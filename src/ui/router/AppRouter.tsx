import { Routes, Route } from "react-router-dom";
import { Landing } from "../pages/Landing";
import { RequestBill } from "../pages/RequestBill";
import { Dashboard } from "../pages/Dashboard";
import { Onboarding } from "../pages/Onboarding";
import { MainLayout } from "../layouts/MainLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Tables } from "../pages/Tables";
import { AuthPage } from "../pages/Auth";
import { AuthCallback } from "../pages/AuthCallback";
import { ForgotPassword } from "../pages/ForgotPassword";
import { ResetPassword } from "../pages/ResetPassword";
import { Profile } from "../pages/Profile";
import { Restaurant } from "../pages/Restaurant";
import { AddBranch } from "../pages/AddBranch";
import { AddBranchResult } from "../pages/AddBranchResult";
import { AddTables } from "../pages/AddTables";
import { AddTablesResult } from "../pages/AddTablesResult";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Ruta pública de solicitud de cuenta (QR) - sin layout */}
      <Route path="/request" element={<RequestBill />} />

      {/* Rutas de autenticación sin layout */}
      <Route path="/login" element={<AuthPage authType="login" />} />
      <Route path="/register" element={<AuthPage authType="register" />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Ruta de setup (sin layout, sin verificación de mesas) */}
      <Route
        path="/dashboard/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Rutas protegidas con layout  */}
      <Route element={<MainLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/tables"
          element={
            <ProtectedRoute>
              <Tables />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/tables/add-tables"
          element={
            <ProtectedRoute>
              <AddTables />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/tables/add-tables/result"
          element={
            <ProtectedRoute>
              <AddTablesResult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/restaurant"
          element={
            <ProtectedRoute>
              <Restaurant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/restaurant/add-branch"
          element={
            <ProtectedRoute>
              <AddBranch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/restaurant/add-branch/result"
          element={
            <ProtectedRoute>
              <AddBranchResult />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRouter;
