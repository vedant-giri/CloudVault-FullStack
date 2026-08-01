import type { ReactNode } from "react";
import {
  ShieldCheck,
  Upload,
  Search,
  LayoutDashboard,
} from "lucide-react";

import Logo from "../components/common/Logo";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Left Side */}
        <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-16 text-white lg:flex lg:flex-col lg:justify-center">
          {/* Decorative Circles */}
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10">
            <Logo />

            <div className="mt-16">
              <h2 className="text-6xl font-extrabold leading-tight">
                Store your
                <br />
                files securely
                <br />
                in the cloud.
              </h2>

              <p className="mt-8 max-w-lg text-xl leading-9 text-blue-100">
                CloudVault lets you securely upload, organize,
                preview, search and access your files from
                anywhere.
              </p>

              <div className="mt-14 space-y-6">
                <div className="flex items-center gap-4">
                  <ShieldCheck className="h-6 w-6" />
                  <span className="text-lg">
                    Secure JWT Authentication
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <Upload className="h-6 w-6" />
                  <span className="text-lg">
                    Drag & Drop Uploads
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <Search className="h-6 w-6" />
                  <span className="text-lg">
                    Instant File Search
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <LayoutDashboard className="h-6 w-6" />
                  <span className="text-lg">
                    Modern Dashboard
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-1 items-center justify-center bg-white px-8 py-12">
          <div className="w-full max-w-lg">
            <div className="mb-10">
              <h1 className="text-5xl font-bold tracking-tight text-slate-900">
                {title}
              </h1>

              <p className="mt-3 text-lg text-slate-500">
                {subtitle}
              </p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}