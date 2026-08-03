import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/next";
import { NotificationProvider } from "./contexts/notification.context";
import { NotificationContainer } from "./components/NotificationContainer";
import AppRouter from "./router/AppRouter";

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <AppRouter />
        <NotificationContainer />
        <Analytics />
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
