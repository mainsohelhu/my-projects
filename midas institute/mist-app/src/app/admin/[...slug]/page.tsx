export default async function AdminSubpage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const moduleName = slug?.[0] || "Module";
  const formattedName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">{formattedName} Management</h1>
      <p className="text-slate-500 max-w-md">
        This module is currently under development. Detailed CRUD functionality for {formattedName} will be available in the next release.
      </p>
    </div>
  );
}
