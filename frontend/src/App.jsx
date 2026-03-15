import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ElectionProvider } from "./context/ElectionContext";
import { Toaster } from "react-hot-toast";
import "./index.css";

const App = () => {
  return (
    <AuthProvider>
      <ElectionProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </ElectionProvider>
    </AuthProvider>
  );
};

export default App;
