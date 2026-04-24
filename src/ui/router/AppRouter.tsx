import { Routes, Route, Navigate } from "react-router-dom";
import { Landing } from "../pages/Landing";
import { NewRequestBill } from "../pages/NewRequestBill";
import { NewDashboard } from "../pages/NewDashboard";
import { Onboarding } from "../pages/Onboarding";
import { MainLayout } from "../layouts/MainLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { OwnerRoute } from "../components/OwnerRoute";
import { Tables } from "../pages/Tables";
import { AuthPage } from "../pages/Auth";
import { AuthCallback } from "../pages/AuthCallback";
import { ForgotPassword } from "../pages/ForgotPassword";
import { ResetPassword } from "../pages/ResetPassword";
import { RoleSelection } from "../pages/RoleSelection";
import { Profile } from "../pages/Profile";
import { Restaurant } from "../pages/Restaurant";
import { AddBranch } from "../pages/AddBranch";
import { AddBranchResult } from "../pages/AddBranchResult";
import { AddTables } from "../pages/AddTables";
import { AddTablesResult } from "../pages/AddTablesResult";
import { Plans } from "../pages/Plans";
import { Subscription } from "../pages/Subscription";
import { SelectPlan } from "../pages/SelectPlan";
import { PaymentSuccess } from "../pages/PaymentSuccess";
import { PaymentFailure } from "../pages/PaymentFailure";
import { PaymentPending } from "../pages/PaymentPending";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Ruta pública de solicitud de cuenta (QR) - sin layout */}
      {/* TODO: temporalmente usando NewRequestBill para preview del nuevo diseño */}
      <Route path="/request" element={<NewRequestBill />} />

      {/* Rutas de autenticación sin layout */}
      <Route path="/login" element={<AuthPage authType="login" />} />
      <Route path="/register" element={<AuthPage authType="register" />} />
      <Route path="/register/role" element={<RoleSelection />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Rutas de setup: solo owners (sin layout) */}
      <Route
        path="/dashboard/onboarding"
        element={
          <OwnerRoute>
            <Onboarding />
          </OwnerRoute>
        }
      />
      <Route
        path="/dashboard/select-plan"
        element={
          <OwnerRoute>
            <SelectPlan />
          </OwnerRoute>
        }
      />

      {/* Rutas de resultado de pago: solo owners (sin layout) */}
      <Route
        path="/payment/success"
        element={
          <OwnerRoute>
            <PaymentSuccess />
          </OwnerRoute>
        }
      />
      <Route
        path="/payment/failure"
        element={
          <OwnerRoute>
            <PaymentFailure />
          </OwnerRoute>
        }
      />
      <Route
        path="/payment/pending"
        element={
          <OwnerRoute>
            <PaymentPending />
          </OwnerRoute>
        }
      />

      {/* Rutas protegidas con layout  */}
      <Route element={<MainLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <NewDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/new"
          element={<Navigate to="/dashboard" replace />}
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
            <OwnerRoute>
              <AddTables />
            </OwnerRoute>
          }
        />
        <Route
          path="/dashboard/tables/add-tables/result"
          element={
            <OwnerRoute>
              <AddTablesResult />
            </OwnerRoute>
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
            <OwnerRoute>
              <Restaurant />
            </OwnerRoute>
          }
        />
        <Route
          path="/dashboard/restaurant/add-branch"
          element={
            <OwnerRoute>
              <AddBranch />
            </OwnerRoute>
          }
        />
        <Route
          path="/dashboard/restaurant/add-branch/result"
          element={
            <OwnerRoute>
              <AddBranchResult />
            </OwnerRoute>
          }
        />
        <Route
          path="/dashboard/plans"
          element={
            <OwnerRoute>
              <Plans />
            </OwnerRoute>
          }
        />
        <Route
          path="/dashboard/subscription"
          element={
            <OwnerRoute>
              <Subscription />
            </OwnerRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRouter;
