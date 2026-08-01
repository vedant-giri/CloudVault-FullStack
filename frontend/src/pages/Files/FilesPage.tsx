import { useState } from "react";

import FileTable from "@/components/dashboard/FileTable";
import Pagination from "@/components/dashboard/Pagination";
import PreviewModal from "@/components/dashboard/PreviewModal";
import SearchBar from "@/components/dashboard/SearchBar";
import ShareDialog from "@/components/dashboard/ShareDialog";

import { useFiles } from "@/hooks/useFiles";

export default function FilesPage() {
  const {
    files,
    loading,

    page,
    setPage,
    totalPages,

    search,
    setSearch,

    handleDelete,
    handleDownload,
    handlePreview,
    handleToggleFavorite,

    previewOpen,
    previewUrl,
    selectedFile,
    closePreview,
  } = useFiles();

  const [shareOpen, setShareOpen] =
    useState(false);

  const [shareFile, setShareFile] =
    useState<{
      id: number;
      filename: string;
    } | null>(null);

  function handleShare(
    file: (typeof files)[number]
  ) {
    setShareFile({
      id: file.id,
      filename: file.filename,
    });

    setShareOpen(true);
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-lg">
        Loading files...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">
        My Files
      </h1>

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      {files.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center text-gray-500 shadow-sm">
          No files found.
        </div>
      ) : (
        <>
          <FileTable
            files={files}
            onDownload={handleDownload}
            onDelete={handleDelete}
            onPreview={handlePreview}
            onToggleFavorite={
              handleToggleFavorite
            }
            onShare={handleShare}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      <PreviewModal
        open={previewOpen}
        title={selectedFile?.filename ?? ""}
        fileType={
          selectedFile?.content_type ?? ""
        }
        previewUrl={previewUrl}
        onClose={closePreview}
      />

      <ShareDialog
        open={shareOpen}
        fileId={shareFile?.id ?? null}
        filename={
          shareFile?.filename ?? ""
        }
        onClose={() => {
          setShareOpen(false);
          setShareFile(null);
        }}
      />
    </div>
  );
}