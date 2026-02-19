import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { NotificationProvider } from "./contexts/notification.context";
import { NotificationContainer } from "./components/NotificationContainer";

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <AppRouter />
        <NotificationContainer />
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
