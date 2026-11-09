import { useRef, useState } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "motion/react";
import { CalendarDays, Users, Scissors, Store, BarChart3, Search } from "lucide-react";
import { useGsap } from "./useGsap";
import { Browser } from "./Devices";
import { salons, services } from "./data";

const tabs = [
  { k: "appts", l: "Appointments", I: CalendarDays },
  { k: "salons", l: "Salons", I: Store },
  { k: "customers", l: "Customers", I: Users },
  { k: "services", l: "Services", I: Scissors },
  { k: "reports", l: "Reports", I: BarChart3 },
] as const;

const appts = [
  ["Sara K.", "Facial", "Glow Studio", "13:00", "Confirmed"],
  ["Nora P.", "Hair Styling", "Aura Hair Salon", "14:30", "Pending"],
  ["Lea M.", "Makeup", "Muse Beauty Lounge", "15:00", "Confirmed"],
  ["Omar T.", "Hair Coloring", "Aura Hair Salon", "16:15", "Rescheduled"],
  ["Maya R.", "Spa Treatments", "Glow Studio", "17:45", "Completed"],
];
const statusCls: Record<string, string> = { Confirmed: "bg-success/15 text-success", Pending: "bg-mod-web/20 text-plum", Rescheduled: "bg-blush text-plum", Completed: "bg-muted text-muted-foreground" };

function Dashboard() {
  const [tab, setTab] = useState<(typeof tabs)[number]["k"]>("appts");
  return (
    <div className="grid min-h-[380px] grid-cols-[160px_1fr] text-xs">
      <aside className="border-r border-border bg-muted/50 p-3">
        <p className="mb-4 font-display text-lg">BeautyHub</p>
        {tabs.map(({ k, l, I }) => (
          <button key={k} onClick={() => setTab(k)} className={`mb-1 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition ${tab === k ? "bg-plum text-cream" : "hover:bg-blush/40"}`}><I className="h-3.5 w-3.5" />{l}</button>
        ))}
      </aside>
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between"><p className="text-sm font-medium">{tabs.find((t) => t.k === tab)?.l}</p><div className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-muted-foreground"><Search className="h-3 w-3" />Search</div></div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            {tab === "appts" && (
              <div className="divide-y divide-border rounded-lg border border-border">
                {appts.map((r) => <div key={r[0]} className="grid grid-cols-[1fr_1fr_1.3fr_50px_80px] items-center gap-2 px-3 py-2"><span className="font-medium">{r[0]}</span><span>{r[1]}</span><span className="text-muted-foreground">{r[2]}</span><span>{r[3]}</span><span className={`rounded-full px-2 py-0.5 text-center text-[10px] ${statusCls[r[4]!]}`}>{r[4]}</span></div>)}
              </div>
            )}
            {tab === "salons" && <div className="grid grid-cols-3 gap-3">{salons.map((s) => <div key={s.id} className="overflow-hidden rounded-lg border border-border"><img src={s.img} alt={s.name} width={1024} height={768} loading="lazy" className="h-20 w-full object-cover" /><div className="p-2"><p className="font-medium">{s.name}</p><p className="text-muted-foreground">{s.area} · Online</p></div></div>)}</div>}
            {tab === "customers" && <div className="space-y-2">{appts.map((r, i) => <div key={r[0]} className="flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2"><span className="grid h-7 w-7 place-items-center rounded-full bg-blush font-medium">{r[0]![0]}</span><span className="flex-1">{r[0]}</span><span className="text-muted-foreground">{i + 2} visits · prefers {r[1]}</span></div>)}</div>}
            {tab === "services" && <div className="grid grid-cols-2 gap-2">{services.map((s) => <div key={s.name} className="flex justify-between rounded-lg border border-border px-3 py-2"><span>{s.name}</span><span className="text-muted-foreground">{s.dur}</span></div>)}</div>}
            {tab === "reports" && (
              <div>
                <div className="flex h-40 items-end gap-2 rounded-lg border border-border p-3">{[30, 52, 44, 70, 62, 85, 58, 76, 90, 68, 80, 95].map((h, i) => <motion.span key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.03 }} className="flex-1 rounded-t bg-rose/70" />)}</div>
                <p className="mt-2 text-[10px] text-muted-foreground">Illustrative chart — sample data, not real performance.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function MultiSalon() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, () => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-pin]", start: "top top", end: "+=2200", scrub: 1, pin: true } });
    tl.from("[data-salon]", { x: (i) => [-1, 1, -1, 1][i] * 420, y: (i) => [-1, -1, 1, 1][i]  , opacity: 0, rotate: (i) => [-8, 8, 6, -6][i], duration: 1, stagger: 0.1 })
      .from("[data-wire]", { scaleY: 0, scaleX: 0, opacity: 0, duration: 0.6 }, "-=0.3")
      .to("[data-salon]", { opacity: 0, scale: 0.6, duration: 0.6 }, "+=0.3")
      .to("[data-wire]", { opacity: 0, duration: 0.3 }, "<")
      .fromTo("[data-dash]", { scale: 0.62 }, { scale: 1, duration: 1 }, "<");
  });

  return (
    <section ref={ref} className="bg-plum-gradient text-cream">
      <div data-pin className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
        <div className="mb-8 text-center">
          <p className="eyebrow text-blush">04 — Multi-Salon Management</p>
          <h2 className="mt-4 text-5xl md:text-7xl">One Platform. <em className="text-blush">Every Salon.</em></h2>
        </div>
        <div className="relative w-full max-w-4xl">
          {[0, 1, 2, 3].map((i) => {
            const s = salons[i % 3]!;
            const pos = ["-left-10 -top-10", "-right-10 -top-10", "-bottom-10 -left-10", "-bottom-10 -right-10"][i];
            return (
              <div key={i} data-salon className={`absolute z-20 hidden w-44 overflow-hidden rounded-xl bg-pure text-plum shadow-float md:block ${pos}`}>
                <img src={s.img} alt="" width={1024} height={768} loading="lazy" className="h-16 w-full object-cover" />
                <p className="p-2 text-xs font-medium">{i === 3 ? "Lumière Spa" : s.name}<span className="ml-1 text-success">● synced</span></p>
              </div>
            );
          })}
          <span data-wire className="absolute left-0 right-0 top-1/2 z-10 hidden h-px bg-blush/60 md:block" />
          <span data-wire className="absolute bottom-0 left-1/2 top-0 z-10 hidden w-px bg-blush/60 md:block" />
          <div data-dash className="relative z-0 text-plum">
            <Browser url="admin.beautyhub.demo"><Dashboard /></Browser>
          </div>
        </div>
      </div>
    </section>
  );
}
