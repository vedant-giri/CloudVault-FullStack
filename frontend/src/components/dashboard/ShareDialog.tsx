import { useState } from "react";
import { X, Send } from "lucide-react";
import { toast } from "sonner";

import { shareFile } from "@/services/fileService";

interface Props {
  open: boolean;
  fileId: number | null;
  filename: string;
  onClose: () => void;
}

export default function ShareDialog({
  open,
  fileId,
  filename,
  onClose,
}: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleShare() {
    if (!fileId) return;

    if (!email.trim()) {
      toast.error("Please enter an email.");
      return;
    }

    try {
      setLoading(true);

      await shareFile(fileId, email);

      toast.success("File shared successfully.");

      setEmail("");

      onClose();
    } catch (err: unknown) {
      console.error(err);

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {
        const response = (
          err as {
            response?: {
              data?: {
                detail?: string;
              };
            };
          }
        ).response;

        toast.error(
          response?.data?.detail ??
            "Failed to share file."
        );
      } else {
        toast.error("Failed to share file.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Share File
          </h2>

          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <p className="mb-2 text-sm text-slate-500">
          Sharing
        </p>

        <p className="mb-5 truncate font-medium">
          {filename}
        </p>

        <input
          type="email"
          value={email}
          placeholder="Recipient email"
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="mb-6 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleShare}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <Send size={18} />
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
}