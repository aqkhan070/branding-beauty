import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, MapPin, Star, Mail, MessageCircle, LayoutDashboard, Store, Smartphone } from "lucide-react";
import { Phone } from "./Devices";
import { salons, services } from "./data";
import { useGsap } from "./useGsap";

const stages = ["Discover Salons", "Choose Services", "Select Appointment", "Booking Confirmed", "Notifications Sent"];
const ease = [0.22, 1, 0.36, 1] as const;

export function BookingJourney() {
  const ref = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const [salon, setSalon] = useState(0);
  const [picked, setPicked] = useState<string[]>(["Facial"]);
  const [day, setDay] = useState(12);
  const [slot, setSlot] = useState(1);
  const trig = useRef<ScrollTrigger | null>(null);

  useGsap(ref, (el) => {
    trig.current = ScrollTrigger.create({
      trigger: el, start: "top top", end: "+=3600", pin: "[data-pin]", scrub: true,
      onUpdate: (s) => setStage(Math.min(4, Math.floor(s.progress * 5))),
    });
  });

  const jump = (i: number) => {
    const t = trig.current;
    if (t) window.scrollTo({ top: t.start + ((t.end - t.start) * (i + 0.5)) / 5, behavior: "smooth" });
    else setStage(i);
  };

  const s = salons[salon]!;
  const card = { initial: { opacity: 0, y: 40, scale: 0.96, filter: "blur(6px)" }, animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }, exit: { opacity: 0, y: -30, scale: 0.97, filter: "blur(6px)" }, transition: { duration: 0.6, ease } };

  return (
    <section id="journey" ref={ref} className="relative bg-secondary/60">
      <div data-pin className="flex min-h-screen items-center">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div>
            <p className="eyebrow">02 — Booking Journey</p>
            <h2 className="mt-4 text-5xl leading-[1.02] md:text-6xl">From Discovery to Appointment. <em className="text-rose">Seamlessly.</em></h2>
            <ol className="mt-10 space-y-1">
              {stages.map((label, i) => (
                <li key={label}>
                  <button onClick={() => jump(i)} className="group flex w-full items-center gap-4 py-2 text-left">
                    <span className={`grid h-8 w-8 place-items-center rounded-full border text-xs transition-all duration-500 ${i < stage ? "border-rose bg-rose text-pure" : i === stage ? "border-plum bg-plum text-cream" : "border-border text-muted-foreground"}`}>
                      {i < stage ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span className={`text-base transition-colors ${i === stage ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>{label}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="mt-6 h-px w-full bg-border"><motion.div className="h-px bg-rose" animate={{ width: `${(stage / 4) * 100}%` }} transition={{ duration: 0.6 }} /></div>
          </div>

          <div className="mx-auto">
            <Phone className="w-[280px]">
              <AnimatePresence mode="wait">
                {stage === 0 && (
                  <motion.div key="d" {...card} className="p-4">
                    <p className="font-display text-2xl">Salons near you</p>
                    {salons.map((x, i) => (
                      <motion.button key={x.id} onClick={() => setSalon(i)} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 * i, ease }}
                        className={`mt-3 block w-full overflow-hidden rounded-2xl bg-pure text-left shadow-soft ring-2 transition ${i === salon ? "ring-rose" : "ring-transparent"}`}>
                        <img src={x.img} alt={x.name} width={1024} height={768} loading="lazy" className="h-20 w-full object-cover" />
                        <div className="flex items-center justify-between p-2.5 text-xs">
                          <div><p className="font-medium">{x.name}</p><p className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" />{x.area}</p></div>
                          <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-rose text-rose" />{x.rating}</span>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
                {stage === 1 && (
                  <motion.div key="s" {...card}>
                    <motion.img layoutId="hero-img" src={s.img} alt={s.name} width={1024} height={768} className="h-28 w-full object-cover" />
                    <div className="p-4">
                      <p className="font-display text-2xl leading-none">{s.name}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">Choose one or more services</p>
                      <div className="mt-3 space-y-1.5">
                        {services.map((sv, i) => {
                          const on = picked.includes(sv.name);
                          return (
                            <motion.button key={sv.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i }}
                              onClick={() => setPicked(on ? picked.filter((p) => p !== sv.name) : [...picked, sv.name])}
                              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${on ? "bg-plum text-cream" : "bg-pure"}`}>
                              <span>{sv.name}</span><span className="opacity-70">{on ? <Check className="h-3.5 w-3.5" /> : sv.dur}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
                {stage === 2 && (
                  <motion.div key="c" {...card} className="p-4">
                    <p className="text-[11px] text-muted-foreground">{s.name}</p>
                    <p className="font-display text-2xl">November 2026</p>
                    <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px]">
                      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i} className="text-muted-foreground">{d}</span>)}
                      {Array.from({ length: 21 }, (_, i) => i + 9).map((d) => {
                        const off = d % 7 === 1;
                        return <button key={d} disabled={off} onClick={() => setDay(d)} className={`rounded-lg py-1.5 transition ${d === day ? "bg-rose text-pure" : off ? "text-border line-through" : "bg-pure hover:bg-blush"}`}>{d}</button>;
                      })}
                    </div>
                    <p className="mt-4 text-[11px] font-medium">Available times</p>
                    <div className="mt-2 grid grid-cols-3 gap-1.5">
                      {s.slots.map((t, i) => <button key={t} onClick={() => setSlot(i)} className={`rounded-lg py-2 text-[11px] transition ${i === slot ? "bg-plum text-cream" : "bg-pure"}`}>{t}</button>)}
                    </div>
                    <div className="mt-4 rounded-full bg-plum py-2.5 text-center text-xs text-cream">Confirm booking</div>
                  </motion.div>
                )}
                {stage === 3 && (
                  <motion.div key="ok" {...card} className="flex h-full flex-col items-center p-5 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="mt-6 grid h-16 w-16 place-items-center rounded-full bg-success text-pure">
                      <Check className="h-8 w-8" />
                    </motion.div>
                    <p className="mt-4 font-display text-3xl">You're booked</p>
                    <div className="mt-5 w-full space-y-2 rounded-2xl bg-pure p-4 text-left text-xs shadow-soft">
                      {[["Salon", s.name], ["Services", picked.join(", ") || "—"], ["Date", `Nov ${day}, 2026`], ["Time", s.slots[slot]!]].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-3"><span className="text-muted-foreground">{k}</span><span className="text-right font-medium">{v}</span></div>
                      ))}
                    </div>
                    <p className="mt-3 text-[9px] text-muted-foreground">Demo booking · not a real transaction</p>
                  </motion.div>
                )}
                {stage === 4 && (
                  <motion.div key="n" {...card} className="p-4">
                    <p className="font-display text-2xl">Syncing…</p>
                    {[[Mail, "Email confirmation sent"], [MessageCircle, "WhatsApp message delivered"], [Store, `${s.name} notified`], [LayoutDashboard, "Recorded in admin"]].map(([I, t], i) => {
                      const Icon = I as typeof Mail;
                      return (
                        <motion.div key={t as string} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 * i }} className="mt-3 flex items-center gap-3 rounded-xl bg-pure p-3 text-xs shadow-soft">
                          <Icon className="h-4 w-4 text-rose" /><span className="flex-1">{t as string}</span><Check className="h-3.5 w-3.5 text-success" />
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </Phone>
          </div>

          <div className="hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.div key={stage} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="ml-auto max-w-xs">
                <p className="font-display text-8xl text-blush">0{stage + 1}</p>
                <p className="mt-2 text-2xl font-display">{stages[stage]}</p>
                {stage === 4 && (
                  <div className="mt-6 space-y-3">
                    {[[Smartphone, "Customer"], [Store, "Selected salon"], [LayoutDashboard, "Central administration"]].map(([I, l], i) => {
                      const Icon = I as typeof Mail;
                      return (
                        <motion.div key={l as string} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.2 }} className="glass flex items-center gap-3 rounded-2xl p-3 text-sm shadow-soft">
                          <Icon className="h-4 w-4 text-mauve" />{l as string}<span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-success" />
                        </motion.div>
                      );
                    })}
                  </div>
                )}
                <p className="mt-6 text-xs text-muted-foreground">Tap the screen to make choices — it's a live demo.</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
