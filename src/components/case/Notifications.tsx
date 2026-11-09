import { useRef, useState } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "motion/react";
import { Check, Mail, MessageCircle, CalendarClock, Store, LayoutDashboard, Zap, Clock } from "lucide-react";
import { useGsap } from "./useGsap";
import { SectionHead } from "./Devices";

export function Notifications() {
  const ref = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<"instant" | "scheduled">("instant");

  useGsap(ref, (el) => {
    const paths = el.querySelectorAll<SVGPathElement>("[data-path]");
    paths.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
    const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-stage]", start: "top 70%", end: "bottom 60%", scrub: 1 } });
    tl.from("[data-core]", { scale: 0.6, opacity: 0, duration: 0.5 })
      .to(paths, { strokeDashoffset: 0, duration: 1, stagger: 0.15 })
      .from("[data-target]", { opacity: 0, y: 40, duration: 0.6, stagger: 0.2 }, "-=0.6");
  });

  return (
    <section ref={ref} className="relative overflow-hidden bg-background py-32">
      <SectionHead eyebrow="03 — Smart Notifications" title="Every Appointment. Everyone in Sync." sub="One booking branches instantly to the customer, the salon and the central system — then reminders follow on schedule." />

      <div className="mt-10 flex justify-center">
        <div className="inline-flex rounded-full border border-border bg-pure p-1 text-sm">
          {([["instant", "Immediate confirmation", Zap], ["scheduled", "Scheduled reminder", Clock]] as const).map(([k, l, I]) => (
            <button key={k} onClick={() => setMode(k)} className="relative flex items-center gap-2 rounded-full px-5 py-2">
              {mode === k && <motion.span layoutId="nt" className="absolute inset-0 rounded-full bg-plum" />}
              <I className={`relative h-4 w-4 ${mode === k ? "text-cream" : ""}`} /><span className={`relative ${mode === k ? "text-cream" : ""}`}>{l}</span>
            </button>
          ))}
        </div>
      </div>

      <div data-stage className="relative mx-auto mt-16 max-w-6xl px-6">
        <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 1000 600" preserveAspectRatio="none" fill="none">
          <path data-path d="M500 170 C 500 260, 170 260, 170 360" stroke="var(--rose)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path data-path d="M500 170 L 500 360" stroke="var(--mauve)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path data-path d="M500 170 C 500 260, 830 260, 830 360" stroke="var(--plum)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>

        <div data-core className="relative z-10 mx-auto w-72 rounded-2xl bg-plum p-5 text-cream shadow-float">
          <div className="flex items-center gap-2 text-xs opacity-70"><CalendarClock className="h-4 w-4" /> New booking · BK-2048</div>
          <p className="mt-2 font-display text-2xl">Facial at Glow Studio</p>
          <p className="text-sm opacity-80">Thu, Nov 12 · 13:00</p>
        </div>

        <div className="relative z-10 mt-24 grid gap-6 lg:grid-cols-3">
          <div data-target>
            <p className="eyebrow mb-3 text-center">Customer</p>
            <AnimatePresence mode="wait">
              {mode === "instant" ? (
                <motion.div key="i" initial={{ opacity: 0, rotateX: -20 }} animate={{ opacity: 1, rotateX: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                  <div className="overflow-hidden rounded-2xl bg-pure shadow-soft">
                    <div className="flex items-center gap-2 bg-blush/50 px-4 py-2 text-xs"><Mail className="h-3.5 w-3.5 text-mail" /><span className="font-medium">Email</span><span className="ml-auto text-muted-foreground">now</span></div>
                    <div className="p-4 text-sm"><p className="font-display text-xl">Your appointment is confirmed</p><p className="mt-1 text-xs text-muted-foreground">Facial · Glow Studio · Nov 12, 13:00</p><div className="mt-3 inline-block rounded-full bg-plum px-3 py-1 text-[11px] text-cream">Add to calendar</div></div>
                  </div>
                  <div className="rounded-2xl bg-wa/10 p-3 shadow-soft">
                    <div className="flex items-center gap-2 text-xs font-medium"><span className="grid h-6 w-6 place-items-center rounded-full bg-wa text-pure"><MessageCircle className="h-3.5 w-3.5" /></span>WhatsApp</div>
                    <div className="mt-2 max-w-[85%] rounded-xl rounded-tl-none bg-pure p-2.5 text-xs">Hi Sara ✨ your Facial at Glow Studio is booked for Thu 13:00.<span className="mt-1 block text-right text-[9px] text-wa">✓✓ 10:02</span></div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="s" initial={{ opacity: 0, rotateX: -20 }} animate={{ opacity: 1, rotateX: 0 }} exit={{ opacity: 0 }} className="rounded-2xl bg-pure p-4 shadow-soft">
                  <div className="flex items-center gap-2 text-xs"><Clock className="h-3.5 w-3.5 text-rose" /> Scheduled · Nov 11, 18:00 or morning of</div>
                  <p className="mt-2 font-display text-xl">Reminder: see you tomorrow</p>
                  <p className="text-xs text-muted-foreground">Sent via email & WhatsApp one day before, or on the booking morning.</p>
                  <div className="mt-4 flex items-center gap-2 text-[11px]">{["Booked", "Confirmed", "Reminder", "Visit"].map((t, i) => <span key={t} className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${i <= 2 ? "bg-rose" : "bg-border"}`} />{t}{i < 3 && <span className="h-px w-4 bg-border" />}</span>)}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div data-target>
            <p className="eyebrow mb-3 text-center">Salon</p>
            <div className="rounded-2xl bg-pure p-4 shadow-soft">
              <div className="flex items-center gap-2 text-sm font-medium"><Store className="h-4 w-4 text-mauve" /> Glow Studio · Calendar</div>
              <div className="mt-3 space-y-1.5 text-xs">
                {["10:30 · Hair Styling · Nora", "13:00 · Facial · Sara", "16:15 · Spa · Lea"].map((r, i) => (
                  <div key={r} className={`flex items-center justify-between rounded-lg px-3 py-2 ${i === 1 ? "bg-rose text-pure" : "bg-muted"}`}>{r}{i === 1 && <span className="rounded-full bg-pure/25 px-2 text-[9px]">NEW</span>}</div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">Customer & service details updated instantly.</p>
            </div>
          </div>

          <div data-target>
            <p className="eyebrow mb-3 text-center">Central system</p>
            <div className="rounded-2xl bg-plum-gradient p-4 text-cream shadow-soft">
              <div className="flex items-center gap-2 text-sm"><LayoutDashboard className="h-4 w-4" /> Admin activity</div>
              {["Appointment recorded", "Glow Studio schedule updated", "Visible in central management"].map((t) => (
                <div key={t} className="mt-2 flex items-center gap-2 rounded-lg bg-pure/10 px-3 py-2 text-xs"><Check className="h-3.5 w-3.5 text-blush" />{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
