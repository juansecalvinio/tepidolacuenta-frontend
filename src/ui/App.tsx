import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { NotificationProvider } from "./contexts/notification.context";

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
