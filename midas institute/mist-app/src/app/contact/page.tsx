import ContactForm from "@/components/forms/ContactForm";

export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <div className="pt-40 pb-24 container mx-auto px-6 text-center flex-1">
        <span className="text-primary text-xs font-black uppercase tracking-[0.3em] block mb-4">Admissions 2026</span>
        <h1 className="text-5xl md:text-7xl font-outfit font-bold text-slate-900 mb-6 leading-tight">
          Get in <span className="text-gradient">Touch</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-12">
          Ready to launch your career? Our admission counselors are standing by to help you choose the right path.
        </p>
        <div className="max-w-2xl mx-auto">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
