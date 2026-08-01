import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  deleteFile,
  downloadFile,
  getFiles,
  getPreviewBlob,
  getStorageStats,
  toggleFavorite,
} from "@/services/fileService";

import type { FileItem } from "@/services/fileService";

export function useFiles() {
  const [stats, setStats] = useState({
    total_files: 0,
    total_storage_bytes: 0,
    average_file_size: 0,
  });

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [totalPages, setTotalPages] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<FileItem | null>(null);

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);

      const [statsData, filesData] = await Promise.all([
        getStorageStats(),
        getFiles(page, pageSize, search),
      ]);

      setStats(statsData);

      setFiles(filesData.items);
      setTotalPages(filesData.pages);
      setTotalFiles(filesData.total);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load files.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadFiles();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadFiles]);

  async function handleDelete(id: number) {
    if (!confirm("Delete this file?")) return;

    try {
      await deleteFile(id);
      await loadFiles();

      toast.success("File deleted successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed.");
    }
  }

  async function handleDownload(file: FileItem) {
    try {
      await downloadFile(file.id, file.filename);
    } catch (err) {
      console.error(err);
      toast.error("Download failed.");
    }
  }

  async function handlePreview(file: FileItem) {
    try {
      const url = await getPreviewBlob(file.id);

      setPreviewUrl(url);
      setSelectedFile(file);
      setPreviewOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Preview failed.");
    }
  }

  async function handleToggleFavorite(
    file: FileItem
  ) {
    try {
      await toggleFavorite(file.id);

      await loadFiles();

      toast.success(
        file.is_favorite
          ? "Removed from Favorites"
          : "Added to Favorites"
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update favorite.");
    }
  }

  function closePreview() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewOpen(false);
    setPreviewUrl(null);
    setSelectedFile(null);
  }

  return {
    stats,
    files,
    loading,

    page,
    setPage,

    pageSize,

    totalPages,
    totalFiles,

    search,
    setSearch,

    loadFiles,

    handleDelete,
    handleDownload,
    handlePreview,
    handleToggleFavorite,

    previewOpen,
    previewUrl,
    selectedFile,
    closePreview,
  };
}