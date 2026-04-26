export default function PrivacyPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <div className="pt-40 pb-24 container mx-auto px-6 md:px-8 max-w-4xl flex-1">
        <span className="text-primary text-xs font-black uppercase tracking-[0.3em] block mb-4">Legal Documentation</span>
        <h1 className="text-5xl md:text-6xl font-outfit font-bold text-slate-900 mb-12">Privacy Policy</h1>
        
        <div className="space-y-12 text-slate-600 leading-relaxed text-lg">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Data Commitment</h2>
            <p>At MIDAS Institute of Software Technology, we prioritize the security of your professional and personal data. This policy outlines our commitment to transparency regarding the collection and utilization of information provided via our digital enrollment and enquiry systems.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information Collection</h2>
            <p>We collect essential data including your name, contact information, and academic interests when you engage with our admission counselors or online registration forms. This data is stored securely on our encrypted MongoDB servers.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data Usage</h2>
            <p>Your information is used strictly for academic counseling, placement assistance, and institutional communication. We do not sell or share student data with third-party marketing firms.</p>
          </section>

          <div className="pt-12 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Effective Date: April 2026</p>
          </div>
        </div>
      </div>
    </main>
  );
}
