import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding trainers...");

  // Delete existing to avoid duplicates if run multiple times
  await prisma.trainer.deleteMany();

  await prisma.trainer.createMany({
    data: [
      {
        name: "Rahul Mishra",
        role: "Lead Full-Stack Instructor",
        experience: "8+ Years",
        shortBio: "Former Amazon SDE. Expert in scalable microservices and React architecture.",
        fullBio: "Rahul is a former Senior SDE at Amazon. He specializes in building scalable microservices and high-performance React frontend architectures. He has mentored over 500+ students globally.",
        photo: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=1000",
        skills: ["React", "Node.js", "AWS", "System Design", "TypeScript"],
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        order: 1,
        isVisible: true,
      },
      {
        name: "Priya Sharma",
        role: "Data Science & AI Specialist",
        experience: "7+ Years",
        shortBio: "Data scientist turned educator, helping students crack AI & ML roles at top tech firms with hands-on project-based learning.",
        fullBio: "Priya Sharma holds an M.Tech from NIT Raipur and spent 5 years as a Data Scientist at a Bengaluru-based AI firm.\n\nAt MIDAS, she heads the Data Science and AI/ML programs with real Kaggle competitions and live model deployments.\n\nHer students have secured roles at Amazon, Accenture Analytics, and multiple AI startups.",
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000",
        skills: ["Python", "Machine Learning", "TensorFlow", "Pandas", "SQL", "Power BI"],
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        order: 2,
        isVisible: true,
      },
      {
        name: "Arjun Verma",
        role: "Cybersecurity Expert & Ethical Hacker",
        experience: "6+ Years",
        shortBio: "Certified ethical hacker and security consultant who has audited systems for government agencies and major banks.",
        fullBio: "Arjun Verma is a CEH and OSCP certified professional with 6+ years in offensive security. He has audited government portals and private banking systems.\n\nAt MIDAS, Arjun runs the Cybersecurity program with CTF challenges and hands-on penetration testing labs.\n\nHis alumni work in security operations centers, bug bounty hunting, and government cyber cells.",
        photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1000",
        skills: ["Ethical Hacking", "Kali Linux", "Network Security", "OWASP", "Metasploit", "Python"],
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        order: 3,
        isVisible: true,
      },
    ],
  });
  console.log("✅ Seeded 3 demo trainers with images successfully!");
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
