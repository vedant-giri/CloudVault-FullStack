import FileTable from "@/components/dashboard/FileTable";
import PreviewModal from "@/components/dashboard/PreviewModal";

import { useFavorites } from "@/hooks/useFavorites";

export default function FavoritesPage() {
  const {
    files,
    loading,

    handleDelete,
    handleDownload,
    handlePreview,
    handleToggleFavorite,

    previewOpen,
    previewUrl,
    selectedFile,
    closePreview,
  } = useFavorites();

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-lg">
        Loading favorites...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">
        Favorite Files
      </h1>

      {files.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center text-gray-500 shadow-sm">
          No favorite files yet.
        </div>
      ) : (
        <FileTable
          files={files}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onPreview={handlePreview}
          onToggleFavorite={handleToggleFavorite}
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