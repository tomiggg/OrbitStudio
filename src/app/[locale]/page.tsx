import { Hero } from "@/components/home/Hero";

export default function HomePage() {
  return (
    <main>
      <Hero />

      {/* Anchor vacío para mantener el link del navbar (#process) */}
      <section
        id="process"
        className="h-1"
        aria-hidden="true"
      />
    </main>
  );
}