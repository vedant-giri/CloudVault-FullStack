interface DashboardStatsProps {
  totalFiles: number;
  storageUsed: string;
}

export default function DashboardStats({
  totalFiles,
  storageUsed,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-sm text-gray-500">
          Total Files
        </h2>

        <p className="mt-2 text-4xl font-bold">
          {totalFiles}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-sm text-gray-500">
          Storage Used
        </h2>

        <p className="mt-2 text-4xl font-bold">
          {storageUsed}
        </p>
      </div>
    </div>
  );
}