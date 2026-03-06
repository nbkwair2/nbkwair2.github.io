import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-indigo-700 text-white px-6 py-4 shadow-md">
          <h1 className="text-xl font-bold">⚙️ Admin Panel</h1>
        </nav>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
