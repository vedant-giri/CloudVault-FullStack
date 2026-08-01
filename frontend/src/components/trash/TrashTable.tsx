import {
  RotateCcw,
  Trash2,
  Download,
  FileText,
  FileImage,
  FileArchive,
  FileSpreadsheet,
  FileVideo,
  FileAudio,
  FileCode,
  File,
} from "lucide-react";

import type { FileItem } from "@/services/fileService";

interface Props {
  files: FileItem[];
  onRestore: (file: FileItem) => void;
  onPermanentDelete: (file: FileItem) => void;
  onDownload: (file: FileItem) => void;
  onPreview: (file: FileItem) => void;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(2)} KB`;

  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getFileIcon(type: string) {
  if (type.includes("pdf"))
    return <FileText className="h-5 w-5 text-red-500" />;

  if (type.startsWith("image/"))
    return <FileImage className="h-5 w-5 text-green-500" />;

  if (
    type.includes("zip") ||
    type.includes("rar") ||
    type.includes("compressed")
  )
    return <FileArchive className="h-5 w-5 text-yellow-600" />;

  if (
    type.includes("excel") ||
    type.includes("spreadsheet")
  )
    return (
      <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
    );

  if (type.includes("word"))
    return <FileText className="h-5 w-5 text-blue-600" />;

  if (type.startsWith("video/"))
    return <FileVideo className="h-5 w-5 text-purple-600" />;

  if (type.startsWith("audio/"))
    return <FileAudio className="h-5 w-5 text-pink-600" />;

  if (
    type.includes("json") ||
    type.includes("javascript") ||
    type.includes("typescript")
  )
    return <FileCode className="h-5 w-5 text-orange-500" />;

  return <File className="h-5 w-5 text-gray-500" />;
}

export default function TrashTable({
  files,
  onRestore,
  onPermanentDelete,
  onDownload,
  onPreview,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="border-b p-5">
        <h2 className="text-xl font-semibold">
          Trash
        </h2>
      </div>

      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left">Type</th>
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Size</th>
            <th className="px-6 py-4 text-left">Deleted</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {files.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-10 text-center text-gray-500"
              >
                Trash is empty.
              </td>
            </tr>
          ) : (
            files.map((file) => {
              const canPreview =
                file.content_type.startsWith("image/") ||
                file.content_type === "application/pdf";

              return (
                <tr
                  key={file.id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    {getFileIcon(file.content_type)}
                  </td>

                  <td
                    className="max-w-xs truncate px-6 py-4 font-medium"
                    title={file.filename}
                  >
                    {canPreview ? (
                      <button
                        onClick={() => onPreview(file)}
                        className="truncate text-left text-blue-600 hover:underline"
                      >
                        {file.filename}
                      </button>
                    ) : (
                      file.filename
                    )}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {formatSize(file.size)}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(file.uploaded_at)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onRestore(file)}
                        className="rounded-lg p-2 text-green-600 hover:bg-green-100"
                        title="Restore"
                      >
                        <RotateCcw size={18} />
                      </button>

                      <button
                        onClick={() => onDownload(file)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-100"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>

                      <button
                        onClick={() => onPermanentDelete(file)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-100"
                        title="Delete Permanently"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}