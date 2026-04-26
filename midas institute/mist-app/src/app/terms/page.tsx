export default function TermsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <div className="pt-40 pb-24 container mx-auto px-6 md:px-8 max-w-4xl flex-1">
        <span className="text-primary text-xs font-black uppercase tracking-[0.3em] block mb-4">Institutional Terms</span>
        <h1 className="text-5xl md:text-6xl font-outfit font-bold text-slate-900 mb-12">Terms of Service</h1>
        
        <div className="space-y-12 text-slate-600 leading-relaxed text-lg">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Enrollment Terms</h2>
            <p>By registering at MIDAS Institute of Software Technology, students agree to adhere to the academic schedule, maintain a minimum attendance of 85%, and participate in all mandatory placement grooming sessions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Intellectual Property</h2>
            <p>All course materials, code repositories, and laboratory resources provided during the training are the intellectual property of MIDAS Institute and are for personal educational use only.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Placement Assistance</h2>
            <p>While Midas provides 100% placement assistance and mock interview training, final job offers are subject to the student's performance in company interview rounds.</p>
          </section>

          <div className="pt-12 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Version: 2.1 (2026)</p>
          </div>
        </div>
      </div>
    </main>
  );
}
