import FileTable from "@/components/dashboard/FileTable";
import PreviewModal from "@/components/dashboard/PreviewModal";

import { useSharedFiles } from "@/hooks/useSharedFiles";

export default function SharedPage() {
  const {
    files,
    loading,

    handleDownload,
    handlePreview,

    previewOpen,
    previewUrl,
    selectedFile,
    closePreview,
  } = useSharedFiles();

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-lg">
        Loading shared files...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">
        Shared With Me
      </h1>

      {files.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center text-gray-500 shadow-sm">
          No files have been shared with you.
        </div>
      ) : (
        <FileTable
          files={files}
          onDownload={handleDownload}
          onPreview={handlePreview}
          onDelete={() => {}}
          onToggleFavorite={() => {}}
          onShare={() => {}}
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