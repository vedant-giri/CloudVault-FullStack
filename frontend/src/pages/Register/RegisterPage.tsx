import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";

import AuthLayout from "../../layouts/AuthLayout";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register({
        full_name: fullName,
        email,
        password,
      });

      navigate("/");
    } catch (err: unknown) {
      console.error(err);

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {
        const response = (err as {
          response?: {
            data?: {
              detail?: string;
            };
          };
        }).response;

        setError(
          response?.data?.detail ??
            "Registration failed."
        );
      } else {
        setError("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Create your CloudVault account."
    >
      <Card className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <Input
            label="Full Name"
            icon={<User size={18} />}
            autoFocus
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            placeholder="Enter your full name"
          />

          <Input
            label="Email"
            icon={<Mail size={18} />}
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            icon={<Lock size={18} />}
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Create a password"
          />

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            <>
              {loading && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}

              {loading
                ? "Creating Account..."
                : "Create Account"}
            </>
          </Button>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Sign In
            </Link>
          </p>
        </form>
      </Card>
    </AuthLayout>
  );
}