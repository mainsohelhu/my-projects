import { Award, Briefcase, Building2, Quote } from "lucide-react";

export default function PlacementsPage() {
  const alumni = [
    { name: "Rahul S.", company: "TCS", role: "Full Stack Developer", quote: "Midas Institute gave me the practical skills I needed to crack the TCS interview." },
    { name: "Sneha P.", company: "Infosys", role: "Data Analyst", quote: "The mock interviews and soft skills training were a game changer for my career." },
    { name: "Aman V.", company: "Wipro", role: "Software Engineer", quote: "Learning here was more like working in a real tech firm than just attending classes." }
  ];

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <section className="pt-40 pb-24 bg-[#f8fafc] border-b border-slate-100">
        <div className="container mx-auto px-6 md:px-8 text-center">
          <span className="text-primary text-sm font-bold uppercase tracking-[0.3em] block mb-4">Career Success</span>
          <h1 className="text-5xl md:text-7xl font-outfit font-bold text-slate-900 mb-6 leading-tight">
            Our <span className="text-gradient">Placement</span> Legacy
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Over 500+ students successfully placed in top MNCs and tech startups across India. Our 100% placement assistance ensures you reach your dream career.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-b border-slate-50">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { label: "Partner Companies", value: "50+", icon: Building2 },
              { label: "Highest Package", value: "12 LPA", icon: Award },
              { label: "Avg Placement Time", value: "3 Months", icon: Briefcase }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <stat.icon size={32} />
                </div>
                <div className="text-4xl font-black text-slate-900 mb-2 font-outfit">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Testimonials */}
      <section className="py-32">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-20">
             <h2 className="text-4xl font-bold font-outfit text-slate-900 mb-4">Voices of Success</h2>
             <p className="text-slate-500 font-medium">Hear it from our students who are now working in top-tier companies.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {alumni.map((person, i) => (
              <div key={i} className="p-10 rounded-[40px] bg-slate-50 border border-slate-100 relative group hover:bg-white hover:shadow-2xl transition-all duration-500">
                <Quote className="absolute top-10 right-10 text-primary opacity-20" size={60} />
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-full bg-slate-200" />
                  <div>
                    <h4 className="font-bold text-slate-900">{person.name}</h4>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">{person.company} • {person.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 italic leading-relaxed">"{person.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Marquee Placeholder */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="container mx-auto px-6 text-center mb-16">
          <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-primary mb-2">Hiring Partners</h3>
          <p className="text-slate-400">Our students are working at leading organizations worldwide.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="text-3xl font-black font-outfit tracking-tighter">GOOGLE</div>
          <div className="text-3xl font-black font-outfit tracking-tighter">MICROSOFT</div>
          <div className="text-3xl font-black font-outfit tracking-tighter">AMAZON</div>
          <div className="text-3xl font-black font-outfit tracking-tighter">INFOSYS</div>
          <div className="text-3xl font-black font-outfit tracking-tighter">TCS</div>
          <div className="text-3xl font-black font-outfit tracking-tighter">WIPRO</div>
        </div>
      </section>
    </main>
  );
}
