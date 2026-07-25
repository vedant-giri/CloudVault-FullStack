import { BrowserRouter, Routes, Route } from "react-router-dom";

function LoginPage() {
  return <h1 className="text-3xl font-bold">Login Page</h1>;
}

function RegisterPage() {
  return <h1 className="text-3xl font-bold">Register Page</h1>;
}

function DashboardPage() {
  return <h1 className="text-3xl font-bold">Dashboard</h1>;
}

function NotFoundPage() {
  return <h1 className="text-3xl font-bold">404 - Page Not Found</h1>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}