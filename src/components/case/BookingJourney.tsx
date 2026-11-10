import { useRef, useState } from "react";
import { gsap } from "gsap";
import { AnimatePresence, motion } from "motion/react";
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

  useGsap(ref, (el) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top 70%", toggleActions: "restart none none reverse" },
      onUpdate: () => setStage(Math.min(4, Math.floor(tl.progress() * 5))),
      onReverseComplete: () => setStage(0),
    });
    // Same 5-stage sequence as the former scrub progress mapping (0→4)
    tl.to({}, { duration: 28 });
  });

  const jump = (i: number) => setStage(i);

  const s = salons[salon]!;
  const card = { initial: { opacity: 0, y: 40, scale: 0.96, filter: "blur(6px)" }, animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }, exit: { opacity: 0, y: -30, scale: 0.97, filter: "blur(6px)" }, transition: { duration: 2, ease } };

  return (
    <section
      id="journey"
      ref={ref}
      className="relative z-0 isolate overflow-hidden"
      style={{
        background:
          "linear-gradient(165deg, #6a5173 0%, #83668c 38%, #9a809f 72%, #7a5f84 100%)",
      }}
    >
      <div data-pin className="flex min-h-screen items-center">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="text-cream">
            <h2 className="type-section">From Discovery to Appointment. <em className="text-rose">Seamlessly.</em></h2>
            <ol className="mt-10 space-y-1">
              {stages.map((label, i) => (
                <li key={label}>
                  <button onClick={() => jump(i)} className="group flex w-full items-center gap-4 py-2 text-left">
                    <span className={`type-label grid h-8 w-8 place-items-center rounded-full border transition-all duration-2000 ${i < stage ? "border-blush bg-blush text-plum" : i === stage ? "border-cream bg-cream text-plum" : "border-cream/30 text-cream/55"}`}>
                      {i < stage ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span className={`type-secondary transition-colors ${i === stage ? "text-cream" : "text-cream/55 group-hover:text-cream"}`}>{label}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="mt-6 h-px w-full bg-cream/25"><motion.div className="h-px bg-blush" animate={{ width: `${(stage / 4) * 100}%` }} transition={{ duration: 2 }} /></div>
          </div>

          <div className="mx-auto">
            <Phone className="w-[280px]">
              <AnimatePresence mode="wait">
                {stage === 0 && (
                  <motion.div key="d" {...card} className="p-4">
                    <p className="type-card">Salons near you</p>
                    {salons.map((x, i) => (
                      <motion.button key={x.id} onClick={() => setSalon(i)} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 * i, ease }}
                        className={`mt-3 block w-full overflow-hidden rounded-2xl bg-pure text-left shadow-soft ring-2 transition ${i === salon ? "ring-rose" : "ring-transparent"}`}>
                        <img src={x.img} alt={x.name} width={1024} height={768} loading="lazy" className="h-20 w-full object-cover" />
                        <div className="type-ui flex items-center justify-between p-3">
                          <div><p className="font-medium">{x.name}</p><p className="flex items-center gap-1 font-normal text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{x.area}</p></div>
                          <span className="type-label flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-rose text-rose" />{x.rating}</span>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
                {stage === 1 && (
                  <motion.div key="s" {...card}>
                    <motion.img layoutId="hero-img" src={s.img} alt={s.name} width={1024} height={768} className="h-28 w-full object-cover" />
                    <div className="p-4">
                      <p className="type-card leading-none">{s.name}</p>
                      <p className="type-label mt-1.5 text-muted-foreground">Choose one or more services</p>
                      <div className="mt-3 space-y-1.5">
                        {services.map((sv, i) => {
                          const on = picked.includes(sv.name);
                          return (
                            <motion.button key={sv.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 * i }}
                              onClick={() => setPicked(on ? picked.filter((p) => p !== sv.name) : [...picked, sv.name])}
                              className={`type-ui flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-colors ${on ? "bg-plum text-cream" : "bg-pure"}`}>
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
                    <p className="type-label text-muted-foreground">{s.name}</p>
                    <p className="type-card mt-0.5">November 2026</p>
                    <div className="type-label mt-3 grid grid-cols-7 gap-1 text-center">
                      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i} className="text-muted-foreground">{d}</span>)}
                      {Array.from({ length: 21 }, (_, i) => i + 9).map((d) => {
                        const off = d % 7 === 1;
                        return <button key={d} disabled={off} onClick={() => setDay(d)} className={`rounded-lg py-1.5 transition ${d === day ? "bg-rose text-pure" : off ? "text-border line-through" : "bg-pure hover:bg-blush"}`}>{d}</button>;
                      })}
                    </div>
                    <p className="type-ui mt-4">Available times</p>
                    <div className="mt-2 grid grid-cols-3 gap-1.5">
                      {s.slots.map((t, i) => <button key={t} onClick={() => setSlot(i)} className={`type-ui rounded-lg py-2.5 transition ${i === slot ? "bg-plum text-cream" : "bg-pure"}`}>{t}</button>)}
                    </div>
                    <div className="type-ui mt-4 rounded-full bg-plum py-2.5 text-center text-cream">Confirm booking</div>
                  </motion.div>
                )}
                {stage === 3 && (
                  <motion.div key="ok" {...card} className="flex h-full flex-col items-center p-5 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.8 }} className="mt-6 grid h-16 w-16 place-items-center rounded-full bg-success text-pure">
                      <Check className="h-8 w-8" />
                    </motion.div>
                    <p className="type-subhead mt-4">You're booked</p>
                    <div className="type-ui mt-5 w-full space-y-2 rounded-2xl bg-pure p-4 text-left shadow-soft">
                      {[["Salon", s.name], ["Services", picked.join(", ") || "—"], ["Date", `Nov ${day}, 2026`], ["Time", s.slots[slot]!]].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-3"><span className="font-normal text-muted-foreground">{k}</span><span className="text-right font-medium">{v}</span></div>
                      ))}
                    </div>
                    <p className="type-label mt-3 text-muted-foreground">Demo booking · not a real transaction</p>
                  </motion.div>
                )}
                {stage === 4 && (
                  <motion.div key="n" {...card} className="p-4">
                    <p className="type-card">Syncing…</p>
                    {[[Mail, "Email confirmation sent"], [MessageCircle, "WhatsApp message delivered"], [Store, `${s.name} notified`], [LayoutDashboard, "Recorded in admin"]].map(([I, t], i) => {
                      const Icon = I as typeof Mail;
                      return (
                        <motion.div key={t as string} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i }} className="type-ui mt-3 flex items-center gap-3 rounded-xl bg-pure p-3 shadow-soft">
                          <Icon className="h-4 w-4 text-rose" /><span className="flex-1 font-normal">{t as string}</span><Check className="h-3.5 w-3.5 text-success" />
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
              <motion.div key={stage} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 2 }} className="ml-auto max-w-xs text-cream">
                <p className="font-display text-[clamp(4rem,3rem+4vw,6rem)] leading-none text-blush">0{stage + 1}</p>
                <p className="type-subhead mt-2">{stages[stage]}</p>
                {stage === 4 && (
                  <div className="mt-6 space-y-3">
                    {[[Smartphone, "Customer"], [Store, "Selected salon"], [LayoutDashboard, "Central administration"]].map(([I, l], i) => {
                      const Icon = I as typeof Mail;
                      return (
                        <motion.div key={l as string} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 + i * 0.8 }} className="type-nav glass flex items-center gap-3 rounded-2xl p-3 text-plum shadow-soft">
                          <Icon className="h-4 w-4 text-mauve" />{l as string}<span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-success" />
                        </motion.div>
                      );
                    })}
                  </div>
                )}
                <p className="type-label mt-6 text-cream/70">Tap the screen to make choices — it's a live demo.</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
