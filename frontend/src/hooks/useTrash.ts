import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getTrashFiles,
  restoreFile,
  permanentlyDeleteFile,
  downloadFile,
  getPreviewBlob,
} from "@/services/fileService";

import type { FileItem } from "@/services/fileService";

export function useTrash() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [previewOpen, setPreviewOpen] =
    useState(false);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<FileItem | null>(null);

  const loadTrash = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getTrashFiles();

      setFiles(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load trash.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTrash();
  }, [loadTrash]);

  async function handleRestore(file: FileItem) {
    try {
      await restoreFile(file.id);

      await loadTrash();

      toast.success("File restored.");
    } catch (err) {
      console.error(err);
      toast.error("Restore failed.");
    }
  }

  async function handlePermanentDelete(
    file: FileItem
  ) {
    if (
      !confirm(
        "Permanently delete this file?"
      )
    )
      return;

    try {
      await permanentlyDeleteFile(file.id);

      await loadTrash();

      toast.success(
        "File permanently deleted."
      );
    } catch (err) {
      console.error(err);
      toast.error(
        "Permanent delete failed."
      );
    }
  }

  async function handleDownload(file: FileItem) {
    try {
      await downloadFile(
        file.id,
        file.filename
      );
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

    loadTrash,

    handleRestore,
    handlePermanentDelete,
    handleDownload,
    handlePreview,

    previewOpen,
    previewUrl,
    selectedFile,
    closePreview,
  };
}