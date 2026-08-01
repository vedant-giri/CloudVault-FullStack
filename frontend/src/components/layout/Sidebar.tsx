import {
  LayoutDashboard,
  Folder,
  Star,
  Share2,
  Trash2,
  Settings,
  Cloud,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "My Files",
    icon: Folder,
    path: "/files",
  },
  {
    title: "Favorites",
    icon: Star,
    path: "/favorites",
  },
  {
    title: "Shared",
    icon: Share2,
    path: "/shared",
  },
  {
    title: "Trash",
    icon: Trash2,
    path: "/trash",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 border-r bg-white lg:flex lg:flex-col">
      <div className="flex items-center gap-3 border-b px-6 py-5">
        <Cloud className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-xl font-bold">CloudVault</h1>
          <p className="text-xs text-gray-500">
            Secure File Storage
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={20} />
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}