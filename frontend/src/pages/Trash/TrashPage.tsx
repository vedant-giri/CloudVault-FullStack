import TrashTable from "@/components/trash/TrashTable";
import PreviewModal from "@/components/dashboard/PreviewModal";

import { useTrash } from "@/hooks/useTrash";

export default function TrashPage() {
  const {
    files,
    loading,

    handleRestore,
    handlePermanentDelete,
    handleDownload,
    handlePreview,

    previewOpen,
    previewUrl,
    selectedFile,
    closePreview,
  } = useTrash();

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-lg">
        Loading trash...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">
        Trash
      </h1>

      {files.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center text-gray-500 shadow-sm">
          Trash is empty.
        </div>
      ) : (
        <TrashTable
          files={files}
          onRestore={handleRestore}
          onPermanentDelete={handlePermanentDelete}
          onDownload={handleDownload}
          onPreview={handlePreview}
        />
      )}

      <PreviewModal
        open={previewOpen}
        title={selectedFile?.filename ?? ""}
        fileType={selectedFile?.content_type ?? ""}
        previewUrl={previewUrl}
        onClose={closePreview}
      />
    </div>
  );
}