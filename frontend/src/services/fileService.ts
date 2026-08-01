import api from "@/api/axios";

export interface FileItem {
  id: number;
  filename: string;
  content_type: string;
  size: number;
  uploaded_at: string;
  is_favorite: boolean;
}

export interface StorageStats {
  total_files: number;
  total_storage_bytes: number;
  average_file_size: number;
}

export interface PaginatedFiles {
  items: FileItem[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export const uploadFile = async (
  file: File,
  onUploadProgress?: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress(event) {
      if (!event.total) return;

      const progress = Math.round((event.loaded * 100) / event.total);

      onUploadProgress?.(progress);
    },
  });

  return response.data;
};

export const getFiles = async (
  page = 1,
  pageSize = 20,
  search = ""
): Promise<PaginatedFiles> => {
  const response = await api.get("/files", {
    params: {
      page,
      page_size: pageSize,
      search: search || undefined,
    },
  });

  return response.data;
};

export const getRecentFiles = async () => {
  const response = await api.get("/files/recent");
  return response.data;
};

export const getStorageStats = async () => {
  const response = await api.get("/files/stats");
  return response.data;
};

export const deleteFile = async (id: number) => {
  await api.delete(`/files/${id}`);
};

export const downloadFile = async (id: number, filename: string) => {
  const response = await api.get(`/files/${id}/download`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(response.data);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};

export const getPreviewBlob = async (id: number) => {
  const response = await api.get(`/files/${id}/preview`, {
    responseType: "blob",
  });

  return URL.createObjectURL(response.data);
};

export const toggleFavorite = async (id: number) => {
  const response = await api.patch(
    `/files/${id}/favorite`
  );

  return response.data;
};

export const getFavoriteFiles = async () => {
  const response = await api.get(
    "/files/favorites"
  );

  return response.data;
};

export const getTrashFiles = async () => {
  const response = await api.get("/files/trash");
  return response.data;
};

export const restoreFile = async (id: number) => {
  await api.patch(`/files/${id}/restore`);
};

export const permanentlyDeleteFile = async (id: number) => {
  await api.delete(`/files/${id}/permanent`);
};

export const shareFile = async (
  id: number,
  email: string
) => {
  const response = await api.post(
    `/files/${id}/share`,
    {
      email,
    }
  );

  return response.data;
};

export const getSharedFiles = async () => {
  const response = await api.get(
    "/files/shared"
  );

  return response.data;
};