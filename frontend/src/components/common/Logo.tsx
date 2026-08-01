export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-2xl text-white shadow-md">
        ☁️
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          CloudVault
        </h1>

        <p className="text-sm text-slate-500">
          Secure Cloud Storage
        </p>
      </div>
    </div>
  );
}