import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";

import DashboardPage from "../pages/Dashboard/DashboardPage";
import FilesPage from "../pages/Files/FilesPage";
import FavoritesPage from "../pages/Favorites/FavoritesPage";
import SharedPage from "../pages/Shared/SharedPage";
import TrashPage from "../pages/Trash/TrashPage";
import SettingsPage from "../pages/Settings/SettingsPage";

import NotFoundPage from "../pages/NotFound/NotFoundPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/files"
            element={<FilesPage />}
          />

          <Route
            path="/favorites"
            element={<FavoritesPage />}
          />

          <Route
            path="/shared"
            element={<SharedPage />}
          />

          <Route
            path="/trash"
            element={<TrashPage />}
          />

          <Route
            path="/settings"
            element={<SettingsPage />}
          />
        </Route>

        <Route
          path="/home"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}