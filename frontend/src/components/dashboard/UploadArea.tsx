import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

import { uploadFile } from "@/services/fileService";

interface UploadAreaProps {
  onUploadSuccess: () => Promise<void>;
}

export default function UploadArea({
  onUploadSuccess,
}: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  async function uploadSelectedFile(file: File) {
    try {
      setUploading(true);
      setProgress(0);

      await uploadFile(file, (percent) => {
        setProgress(percent);
      });

      await onUploadSuccess();

      toast.success("File uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
      setProgress(0);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files ?? []);

    if (files.length === 0) return;

    for (const file of files) {
      await uploadSelectedFile(file);
    }
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();

    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);

    for (const file of files) {
      await uploadSelectedFile(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-xl border-2 border-dashed bg-white p-10 text-center transition
      ${
        dragActive
          ? "border-blue-600 bg-blue-50"
          : "border-slate-300 hover:border-blue-500"
      }`}
    >
      <Upload className="mx-auto mb-4 h-12 w-12 text-blue-600" />

      <h2 className="text-xl font-semibold">
        Upload your files
      </h2>

      <p className="mt-2 text-gray-500">
        Drag & Drop files here
      </p>

      <p className="my-3 text-gray-400">or</p>

      <button
        onClick={handleBrowse}
        disabled={uploading}
        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Browse Files"}
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        onChange={handleFileChange}
      />

      {uploading && (
        <div className="mt-6">
          <div className="mb-2 font-medium">
            Uploading... {progress}%
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}