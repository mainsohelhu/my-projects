import { Users, GraduationCap, Award } from "lucide-react";

export default function FacultyPage() {
  const facultyMembers = [
    { name: "Er. Sohel Khan", role: "Chief Mentor & Lead Architect", specialization: "Full Stack Development & AI", experience: "10+ Years" },
    { name: "Ms. Priyanka D.", role: "Senior Consultant", specialization: "Soft Skills & Corporate Grooming", experience: "8+ Years" },
    { name: "Mr. Rahul V.", role: "Technical Lead", specialization: "Cloud Computing & Dev Ops", experience: "6+ Years" }
  ];

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <section className="pt-40 pb-24 bg-[#f8fafc] border-b border-slate-100">
        <div className="container mx-auto px-6 md:px-8 text-center">
          <span className="text-primary text-sm font-bold uppercase tracking-[0.3em] block mb-4">Academic Excellence</span>
          <h1 className="text-5xl md:text-7xl font-outfit font-bold text-slate-900 mb-6 leading-tight">
            Meet Our <span className="text-gradient">Elite Faculty</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Learn from industry veterans who have worked in top MNCs. Our mentors don't just teach; they guide you through real-world professional challenges.
          </p>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-24 container mx-auto px-6 md:px-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {facultyMembers.map((member, i) => (
            <div key={i} className="group p-10 rounded-[40px] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-slate-100 mb-8 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                 <Users size={40} className="text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold font-outfit text-slate-900 mb-2">{member.name}</h3>
              <p className="text-primary font-bold text-sm uppercase tracking-widest mb-6">{member.role}</p>
              
              <div className="w-full pt-8 border-t border-slate-50 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Expertise</span>
                  <span className="text-slate-900 font-bold">{member.specialization}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Experience</span>
                  <span className="text-slate-900 font-bold">{member.experience}</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary transition-colors cursor-pointer"><GraduationCap size={20} /></div>
                 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary transition-colors cursor-pointer"><Award size={20} /></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
