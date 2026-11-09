import { useRef } from "react";
import { gsap } from "gsap";
import { Headphones, LayoutDashboard, Smartphone, Globe, MessageCircle, Users, Scissors } from "lucide-react";
import { useGsap } from "./useGsap";
import { Phone, Browser } from "./Devices";
import { salons } from "./data";

const platforms = [
  { key: "support", label: "Customer Services", icon: Headphones, color: "text-mod-support", bg: "bg-mod-support", desc: "Inquiries, booking assistance & live communication." },
  { key: "admin", label: "Admin Panel", icon: LayoutDashboard, color: "text-mod-admin", bg: "bg-mod-admin", desc: "Salons, staff, services and bookings — centralised." },
  { key: "mobile", label: "Mobile App", icon: Smartphone, color: "text-mod-mobile", bg: "bg-mod-mobile", desc: "Discover salons, pick services, book a slot." },
  { key: "web", label: "Web Application", icon: Globe, color: "text-mod-web", bg: "bg-mod-web", desc: "Booking for clients, schedule tools for salons." },
];

function SupportUI() {
  return (
    <div className="w-72 rounded-2xl bg-pure p-4 shadow-float">
      <div className="flex items-center gap-2 border-b border-border pb-3 text-sm font-medium"><MessageCircle className="h-4 w-4 text-mod-support" /> Support inbox</div>
      {[["Lina", "Is the 3pm facial still free?"], ["Omar", "Need to reschedule my colour."], ["Maya", "Do you offer bridal makeup?"]].map(([n, m], i) => (
        <div key={n} className={`mt-3 rounded-xl p-2.5 text-xs ${i === 0 ? "bg-mod-support/15" : "bg-muted"}`}><p className="font-medium">{n}</p><p className="text-muted-foreground">{m}</p></div>
      ))}
    </div>
  );
}
function AdminUI() {
  return (
    <div className="w-80 rounded-2xl bg-plum-gradient p-4 text-cream shadow-float">
      <p className="text-xs opacity-70">Central admin</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {[[Scissors, "Salons"], [Users, "Staff"], [LayoutDashboard, "Bookings"]].map(([I, l]) => {
          const Icon = I as typeof Users;
          return <div key={l as string} className="rounded-xl bg-pure/10 p-2 text-[10px]"><Icon className="mx-auto mb-1 h-4 w-4" />{l as string}</div>;
        })}
      </div>
      <div className="mt-3 space-y-1.5">{salons.map((s, i) => <div key={s.id} className="flex items-center justify-between rounded-lg bg-pure/10 px-2.5 py-1.5 text-[11px]">{s.name}<span className="h-1.5 rounded-full bg-blush" style={{ width: 30 + i * 14 }} /></div>)}</div>
    </div>
  );
}
function MobileUI() {
  return (
    <Phone className="w-[180px]">
      <div className="p-3">
        <img src={salons[1].img} alt="Muse Beauty Lounge" width={1024} height={768} loading="lazy" className="h-24 w-full rounded-xl object-cover" />
        <p className="mt-2 font-display text-lg leading-tight">Muse Beauty Lounge</p>
        <div className="mt-2 grid grid-cols-3 gap-1">{salons[1].slots.map((s) => <span key={s} className="rounded-md bg-secondary py-1 text-center text-[9px]">{s}</span>)}</div>
        <div className="mt-3 rounded-full bg-plum py-1.5 text-center text-[10px] text-cream">Book now</div>
      </div>
    </Phone>
  );
}
function WebUI() {
  return (
    <Browser className="w-[340px]" url="book.beautyhub.demo">
      <div className="grid grid-cols-3 gap-2 p-3">
        {salons.map((s) => (
          <div key={s.id} className="overflow-hidden rounded-lg border border-border">
            <img src={s.img} alt="" width={1024} height={768} loading="lazy" className="h-14 w-full object-cover" />
            <p className="truncate p-1.5 text-[10px] font-medium">{s.name}</p>
          </div>
        ))}
      </div>
      <div className="mx-3 mb-3 flex gap-1">{Array.from({ length: 7 }, (_, i) => <span key={i} className={`h-6 flex-1 rounded ${i === 3 ? "bg-mod-web" : "bg-muted"}`} />)}</div>
    </Browser>
  );
}
const uis = [SupportUI, AdminUI, MobileUI, WebUI];
// final positions around hub (percent of stage)
const spots = [
  { x: -34, y: -24 }, { x: 34, y: -24 }, { x: -34, y: 26 }, { x: 34, y: 26 },
];

export function Ecosystem() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, (el) => {
    const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
    const labels = gsap.utils.toArray<HTMLElement>("[data-label]");
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top top", end: "+=3200", scrub: 1, pin: "[data-pin]" },
    });
    panels.forEach((p, i) => {
      gsap.set(p, { xPercent: -50, yPercent: -50, opacity: 0, scale: 1.4, rotate: i % 2 ? 6 : -6, y: 200 });
      tl.to(p, { opacity: 1, scale: 1, rotate: 0, y: 0, duration: 1 }, i * 1.1)
        .to(labels[i], { opacity: 1, x: 0, duration: 0.5 }, i * 1.1 + 0.2)
        .to(labels[i], { opacity: 0.35, duration: 0.3 }, i * 1.1 + 1)
        .to(p, { x: () => (spots[i].x / 100) * el.clientWidth * 0.9, y: () => (spots[i].y / 100) * window.innerHeight, scale: 0.72, duration: 1 }, i * 1.1 + 0.8);
    });
    tl.to("[data-hub]", { opacity: 1, scale: 1, duration: 0.8 }, 4.6)
      .to("[data-link]", { strokeDashoffset: 0, duration: 1 }, 4.8)
      .to(labels, { opacity: 1, duration: 0.4 }, 5);
  });

  return (
    <section id="ecosystem" ref={ref} className="relative bg-background">
      <div data-pin className="relative h-screen overflow-hidden">
        <div className="absolute left-6 top-24 z-20 max-w-sm md:left-12">
          <p className="eyebrow">01 — The Ecosystem</p>
          <h2 className="mt-4 text-4xl leading-[1.05] md:text-6xl">Four Platforms. One Beautifully Connected Experience.</h2>
          <ul className="mt-8 space-y-3">
            {platforms.map((p) => (
              <li key={p.key} data-label className="flex translate-x-0 items-start gap-3 md:-translate-x-4 md:opacity-0">
                <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${p.bg}`} />
                <div><p className="text-sm font-medium">{p.label}</p><p className="text-xs text-muted-foreground">{p.desc}</p></div>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute inset-0 hidden md:block md:left-[28%]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {spots.map((s, i) => (
              <line key={i} data-link x1="50" y1="50" x2={50 + s.x * 0.9} y2={50 + s.y} stroke="var(--rose)" strokeWidth="0.15" strokeDasharray="100" strokeDashoffset="100" vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
          <div data-hub className="absolute left-1/2 top-1/2 grid h-36 w-36 -translate-x-1/2 -translate-y-1/2 scale-50 place-items-center rounded-full bg-plum text-center text-cream opacity-0 shadow-float">
            <div><p className="font-display text-2xl leading-none">One</p><p className="text-[10px] tracking-[0.25em] opacity-70">ECOSYSTEM</p></div>
            <span className="absolute inset-[-14px] rounded-full border border-rose/40" />
            <span className="absolute inset-[-34px] rounded-full border border-blush/50" />
          </div>
          {uis.map((UI, i) => (
            <div key={i} data-panel className="absolute left-1/2 top-1/2">
              <p className={`mb-2 text-center text-[11px] font-medium uppercase tracking-[0.2em] ${platforms[i].color}`}>{platforms[i].label}</p>
              <UI />
            </div>
          ))}
        </div>

        {/* mobile fallback: stacked scroll */}
        <div className="absolute inset-x-0 bottom-0 top-[60%] flex gap-4 overflow-x-auto px-6 pb-8 md:hidden">
          {uis.map((UI, i) => <div key={i} className="shrink-0 origin-top-left scale-75"><UI /></div>)}
        </div>
      </div>
    </section>
  );
}
