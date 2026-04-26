import HeroSection from "@/components/home/HeroSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import TrainersSection from "@/components/home/TrainersSection";
import SoftSkillsSection from "@/components/home/SoftSkillsSection";
import CoursesSection from "@/components/home/CoursesSection";
import VideoGallerySection from "@/components/home/VideoGallerySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ContactFormSection from "@/components/home/ContactFormSection";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();
  const user = session?.user || null;

  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <BenefitsSection />
      <TrainersSection />
      <SoftSkillsSection />
      <CoursesSection />
      <VideoGallerySection />
      <TestimonialsSection user={user} />
      <ContactFormSection />
    </main>
  );
}
