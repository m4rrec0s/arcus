import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Manifesto from "@/components/Manifesto";
import Services from "@/components/Services";
import Process from "@/components/Process";
import TechGrid from "@/components/TechGrid";
import Cases from "@/components/Cases";
import Mira from "@/components/Mira";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-[#0A0A0C]">
      <Hero />
      <Marquee />
      <Manifesto />
      <Services />
      <Process />
      <TechGrid />
      <Cases />
      <Mira />
      <Contact />
      <Footer />
    </main>
  );
}
