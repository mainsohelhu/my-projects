import ContactForm from "@/components/forms/ContactForm";

export default function EnrollPage() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <div className="pt-32 pb-24 container mx-auto px-6 text-center flex-1">
        <h1 className="text-4xl font-space font-bold text-slate-900 mb-6">Enroll Now</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Secure your seat in our upcoming batches and start your tech career.
        </p>
        <ContactForm />
      </div>
    </main>
  );
}
