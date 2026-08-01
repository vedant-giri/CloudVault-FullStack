import { X } from "lucide-react";
import { useEffect } from "react";

interface Props {
  open: boolean;
  title: string;
  fileType: string;
  previewUrl: string | null;
  onClose: () => void;
}

export default function PreviewModal({
  open,
  title,
  fileType,
  previewUrl,
  onClose,
}: Props) {
  
  useEffect(() => {
  if (!open) return;

  const handler = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  window.addEventListener("keydown", handler);

  return () => {
    window.removeEventListener("keydown", handler);
  };
}, [open, onClose]);

  if (!open || !previewUrl) return null;

  const isImage = fileType.startsWith("image/");
  const isPdf = fileType === "application/pdf";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative flex h-[90vh] w-[90vw] flex-col rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold truncate">{title}</h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-hidden p-4">
          {isImage && (
            <img
                src={previewUrl}
                alt={title}
                className="max-h-full max-w-full rounded-lg object-contain"
                loading="lazy"
            />
          )}

          {isPdf && (
            <iframe
                src={previewUrl}
                title={title}
                className="h-full w-full rounded-lg"
                loading="lazy"
            />
          )}

          {!isImage && !isPdf && (
            <div className="text-center">
              <p className="text-lg font-medium">
                Preview not available
              </p>

              <p className="text-gray-500">
                This file type cannot be previewed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}