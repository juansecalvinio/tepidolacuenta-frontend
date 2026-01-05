import { Routes, Route } from "react-router-dom";
import { Landing } from "../pages/Landing";
import { RequestBill } from "../pages/RequestBill";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Dashboard } from "../pages/Dashboard";
import { Onboarding } from "../pages/Dashboard/Onboarding";
import { MainLayout } from "../layouts/MainLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Tables } from "../pages/Dashboard/Tables";

function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas con layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* Ruta pública de solicitud de cuenta (QR) - sin layout */}
      <Route path="/request" element={<RequestBill />} />

      {/* Rutas de autenticación sin layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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
      </Route>
    </Routes>
  );
}

export default AppRouter;
