import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ElectionProvider } from "./context/ElectionContext";
import "./index.css";

const App = () => {
  return (
    <AuthProvider>
      <ElectionProvider>
        <AppRoutes />
      </ElectionProvider>
    </AuthProvider>
  );
};

export default App;
