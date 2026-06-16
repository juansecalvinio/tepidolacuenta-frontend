import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { OwnerRoute } from "../components/OwnerRoute";

// Páginas cargadas de forma diferida (code-splitting por ruta).
const Landing = lazy(() =>
  import("../pages/Landing").then((m) => ({ default: m.Landing })),
);
const NewRequestBill = lazy(() =>
  import("../pages/NewRequestBill").then((m) => ({ default: m.NewRequestBill })),
);
const NewDashboard = lazy(() =>
  import("../pages/NewDashboard").then((m) => ({ default: m.NewDashboard })),
);
const Onboarding = lazy(() =>
  import("../pages/Onboarding").then((m) => ({ default: m.Onboarding })),
);
const Tables = lazy(() =>
  import("../pages/Tables").then((m) => ({ default: m.Tables })),
);
const AuthPage = lazy(() =>
  import("../pages/Auth").then((m) => ({ default: m.AuthPage })),
);
const AuthCallback = lazy(() =>
  import("../pages/AuthCallback").then((m) => ({ default: m.AuthCallback })),
);
const ForgotPassword = lazy(() =>
  import("../pages/ForgotPassword").then((m) => ({ default: m.ForgotPassword })),
);
const ResetPassword = lazy(() =>
  import("../pages/ResetPassword").then((m) => ({ default: m.ResetPassword })),
);
const RoleSelection = lazy(() =>
  import("../pages/RoleSelection").then((m) => ({ default: m.RoleSelection })),
);
const Profile = lazy(() =>
  import("../pages/Profile").then((m) => ({ default: m.Profile })),
);
const Restaurant = lazy(() =>
  import("../pages/Restaurant").then((m) => ({ default: m.Restaurant })),
);
const AddBranch = lazy(() =>
  import("../pages/AddBranch").then((m) => ({ default: m.AddBranch })),
);
const AddBranchResult = lazy(() =>
  import("../pages/AddBranchResult").then((m) => ({
    default: m.AddBranchResult,
  })),
);
const AddTables = lazy(() =>
  import("../pages/AddTables").then((m) => ({ default: m.AddTables })),
);
const AddTablesResult = lazy(() =>
  import("../pages/AddTablesResult").then((m) => ({
    default: m.AddTablesResult,
  })),
);
const Plans = lazy(() =>
  import("../pages/Plans").then((m) => ({ default: m.Plans })),
);
const Subscription = lazy(() =>
  import("../pages/Subscription").then((m) => ({ default: m.Subscription })),
);
const SelectPlan = lazy(() =>
  import("../pages/SelectPlan").then((m) => ({ default: m.SelectPlan })),
);
const PaymentSuccess = lazy(() =>
  import("../pages/PaymentSuccess").then((m) => ({ default: m.PaymentSuccess })),
);
const PaymentFailure = lazy(() =>
  import("../pages/PaymentFailure").then((m) => ({ default: m.PaymentFailure })),
);
const PaymentPending = lazy(() =>
  import("../pages/PaymentPending").then((m) => ({ default: m.PaymentPending })),
);

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-base-100">
    <span
      className="loading loading-spinner loading-lg text-primary"
      aria-label="Cargando…"
    />
  </div>
);

function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  );
}

export default AppRouter;
