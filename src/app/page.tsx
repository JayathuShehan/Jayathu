import MatrixRain from "@/components/matrix-rain";
import Hero from "@/components/hero";
import About from "@/components/about";
import Skills from "@/components/skills";
import Contact from "@/components/contact";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white selection:bg-green-500 selection:text-black">
      <MatrixRain />

      <div className="relative z-10 w-full">
        <Hero />
        <About />
        <Skills />
        <Contact />
      </div>
    </main>
  );
}
