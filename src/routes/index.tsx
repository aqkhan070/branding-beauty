import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll, scrollToId } from "@/components/case/SmoothScroll";
import { Hero } from "@/components/case/Hero";
import { Ecosystem } from "@/components/case/Ecosystem";
import { BookingJourney } from "@/components/case/BookingJourney";
import { Notifications } from "@/components/case/Notifications";
import { MultiSalon } from "@/components/case/MultiSalon";
import { Integrations } from "@/components/case/Integrations";
import { Showcase } from "@/components/case/Showcase";
import { Finale } from "@/components/case/Finale";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beauty, Connected Beautifully — Salon Ecosystem Case Study" },
      { name: "description", content: "Case study: a multi-salon beauty ecosystem with mobile app, web app, admin panel and customer services, all in sync." },
      { property: "og:title", content: "Beauty, Connected Beautifully — Case Study" },
      { property: "og:description", content: "How we built a connected multi-salon booking and management ecosystem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <SmoothScroll />
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-12">
        <span className="font-display text-xl">Beauty<em className="text-rose">Hub</em></span>
        <nav className="glass hidden gap-6 rounded-full px-5 py-2 text-xs md:flex">
          {[["ecosystem", "Ecosystem"], ["journey", "Journey"]].map(([id, l]) => <button key={id} onClick={() => scrollToId(id)} className="hover:text-rose">{l}</button>)}
        </nav>
        <span className="eyebrow hidden md:block">Case Study · 2026</span>
      </header>
      <Hero />
      <Ecosystem />
      <BookingJourney />
      <Notifications />
      <MultiSalon />
      <Integrations />
      <Showcase />
      <Finale />
    </main>
  );
}
