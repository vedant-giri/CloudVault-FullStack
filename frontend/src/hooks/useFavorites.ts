import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  deleteFile,
  downloadFile,
  getFavoriteFiles,
  getPreviewBlob,
  toggleFavorite,
} from "@/services/fileService";

import type { FileItem } from "@/services/fileService";

export function useFavorites() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [previewOpen, setPreviewOpen] =
    useState(false);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<FileItem | null>(null);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getFavoriteFiles();

      setFiles(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  async function handleDelete(id: number) {
    if (!confirm("Delete this file?")) return;

    try {
      await deleteFile(id);

      await loadFavorites();

      toast.success("File deleted.");
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

      await loadFavorites();

      toast.success("Favorites updated.");
    } catch (err) {
      console.error(err);
      toast.error("Update failed.");
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
  };
}