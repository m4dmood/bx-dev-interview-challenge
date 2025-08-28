import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FilesPage from "./Files";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "./Login";

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/files" 
          element={
            <ProtectedRoute>
              <FilesPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/files" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
