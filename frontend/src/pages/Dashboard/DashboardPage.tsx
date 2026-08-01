import DashboardStats from "@/components/dashboard/DashboardStats";
import FileTable from "@/components/dashboard/FileTable";
import UploadArea from "@/components/dashboard/UploadArea";
import PreviewModal from "@/components/dashboard/PreviewModal";
import { useState } from "react";
import ShareDialog from "@/components/dashboard/ShareDialog";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const {
    stats,
    files,
    loading,

    loadDashboard,

    handleDelete,
    handleDownload,
    handlePreview,
    handleToggleFavorite,

    previewOpen,
    previewUrl,
    selectedFile,
    closePreview,
  } = useDashboard();

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 * 1024)
      return `${(bytes / 1024).toFixed(2)} KB`;

    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
  const [shareOpen, setShareOpen] = useState(false);

  const [shareFile, setShareFile] = useState<{
    id: number;
    filename: string;
  } | null>(null);

  function handleShare(file: typeof files[number]) {
    setShareFile({
      id: file.id,
      filename: file.filename,
    });

    setShareOpen(true);
  }
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <DashboardStats
        totalFiles={stats.total_files}
        storageUsed={formatSize(stats.total_storage_bytes)}
      />

      <UploadArea onUploadSuccess={loadDashboard} />

      <div>
        <h2 className="mb-4 text-2xl font-semibold">
          Recent Files
        </h2>

        {files.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center text-gray-500 shadow-sm">
            No recent files.
          </div>
        ) : (
          <FileTable
            files={files}
            onDownload={handleDownload}
            onDelete={handleDelete}
            onPreview={handlePreview}
            onToggleFavorite={handleToggleFavorite}
            onShare={handleShare}
          />
        )}
      </div>

      <PreviewModal
        open={previewOpen}
        title={selectedFile?.filename ?? ""}
        fileType={selectedFile?.content_type ?? ""}
        previewUrl={previewUrl}
        onClose={closePreview}
      />

      <ShareDialog
        open={shareOpen}
        fileId={shareFile?.id ?? null}
        filename={shareFile?.filename ?? ""}
        onClose={() => {
          setShareOpen(false);
          setShareFile(null);
        }}
      />
    </div>
  );
}