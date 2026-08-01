import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  icon?: React.ReactNode;
}

function Input({
  className,
  type,
  label,
  icon,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const isPassword = type === "password";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}

        <InputPrimitive
          type={
            isPassword
              ? showPassword
                ? "text"
                : "password"
              : type
          }
          data-slot="input"
          className={cn(
            "h-12 w-full rounded-xl border border-slate-300 bg-white text-sm shadow-sm transition-all",
            "placeholder:text-slate-400",
            "focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            icon ? "pl-11 pr-12" : "px-4",
            className
          )}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export { Input };