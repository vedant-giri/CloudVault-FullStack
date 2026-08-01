import { Bell, Menu, Search, LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials =
    user?.full_name
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase() || "U";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 hover:bg-gray-100 lg:hidden">
          <Menu size={22} />
        </button>

        <div className="relative hidden md:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <Input
            placeholder="Search files..."
            className="w-80 pl-10"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 hover:bg-gray-100">
          <Bell size={20} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none ring-offset-2 focus:ring-2">
            <Avatar className="cursor-pointer">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-semibold">
                  {user?.full_name}
                </span>

                <span className="text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}