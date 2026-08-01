import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  downloadFile,
  getPreviewBlob,
  getSharedFiles,
} from "@/services/fileService";

import type { FileItem } from "@/services/fileService";

export function useSharedFiles() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [previewOpen, setPreviewOpen] =
    useState(false);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<FileItem | null>(null);

  const loadShared = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getSharedFiles();

      setFiles(data);
    } catch (err) {
      console.error(err);
      toast.error(
        "Failed to load shared files."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadShared();
  }, [loadShared]);

  async function handleDownload(
    file: FileItem
  ) {
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

  async function handlePreview(
    file: FileItem
  ) {
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

    handleDownload,
    handlePreview,

    previewOpen,
    previewUrl,
    selectedFile,
    closePreview,
  };
}