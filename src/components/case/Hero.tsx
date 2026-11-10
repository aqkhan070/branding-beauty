import { MotionConfig, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { Bell, CalendarDays, Headphones, LayoutDashboard, Star, ArrowDown } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { Phone } from "./Devices";
import { salons } from "./data";
import { scrollToId } from "./SmoothScroll";
import { useGsap } from "./useGsap";
import { gsap } from "gsap";

const ease = [0.22, 1, 0.36, 1] as const;

function Float({ children, depth, mx, my, delay, className }: { children: ReactNode; depth: number; mx: MotionValue<number>; my: MotionValue<number>; delay: number; className: string }) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div style={{ x, y }} className={`absolute will-change-transform ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, delay, ease }}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 60, damping: 20 });
  const my = useSpring(myRaw, { stiffness: 60, damping: 20 });

  useGsap(ref, (el) => {
    const stage = el.querySelector("[data-stage]");
    if (!stage) return;
    gsap.fromTo(stage,
      { scale: 1, yPercent: 0, autoAlpha: 1 },
      {
        scale: 0.9, yPercent: 6, autoAlpha: 0.55, ease: "none", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true },
      });
  });

  const words = ["Beauty,", "Connected", "Beautifully."];

  return (
    <MotionConfig reducedMotion="user">
    <section
      ref={ref}
      onMouseLeave={() => { mxRaw.set(0); myRaw.set(0); }}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const r = e.currentTarget.getBoundingClientRect();
        mxRaw.set((e.clientX - r.width / 2) / r.width * 40);
        myRaw.set((e.clientY - r.height / 2) / r.height * 40);
      }}
      className="grain relative min-h-screen overflow-hidden bg-blush-glow"
    >
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 pb-16 pt-28 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative z-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="eyebrow">
            Beauty Technology / Digital Ecosystem / Case Study
          </motion.p>
          <h1 className="type-hero mt-6">
            {words.map((w, i) => (
              <span key={w} className="block overflow-hidden pb-2">
                <motion.span
                  className={`block ${i === 2 ? "italic text-rose" : ""}`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, delay: 0.2 + i * 0.12, ease }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.7, ease }}
            className="type-body mt-8 max-w-md text-muted-foreground"
          >
            One intelligent digital ecosystem connecting salons, clients, appointments and experiences across every platform.
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            whileHover={{ x: 4 }}
            onClick={() => scrollToId("ecosystem")}
            className="type-nav group mt-10 inline-flex items-center gap-3 rounded-full border border-plum/20 bg-pure/60 py-2 pl-6 pr-2 backdrop-blur transition-colors hover:bg-plum hover:text-cream"
          >
            Explore the Ecosystem
            <span className="grid h-9 w-9 place-items-center rounded-full bg-plum text-cream transition-colors group-hover:bg-rose">
              <ArrowDown className="h-4 w-4" />
            </span>
          </motion.button>
        </div>

        <div data-stage className="relative mx-auto h-[560px] w-full max-w-[600px] origin-center will-change-transform sm:h-[620px]">
          {/* connection lines */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 620" fill="none" preserveAspectRatio="none">
            {["M300 310 C 180 250, 140 140, 90 90", "M300 310 C 430 240, 470 140, 520 110", "M300 310 C 160 380, 120 470, 80 520", "M300 310 C 440 400, 480 480, 530 520", "M300 310 L 560 320"].map((d, i) => (
              <motion.path
                key={d} d={d} stroke="var(--rose)" strokeWidth="1.2" strokeDasharray="4 6" className="dash-flow"
                vectorEffect="non-scaling-stroke"
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                transition={{ duration: 1.2, delay: 1.5 + i * 0.12, ease }}
              />
            ))}
          </svg>

          <Float depth={-0.4} mx={mx} my={my} delay={0.9} className="left-0 top-6">
            <div className="w-56 overflow-hidden rounded-2xl bg-pure shadow-soft">
              <img src={salons[0]!.img} alt="Glow Studio salon interior" width={1024} height={768} className="h-24 w-full object-cover" />
              <div className="p-3.5">
                <div className="type-ui flex items-center justify-between">{salons[0]!.name}<span className="type-label flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-rose text-rose" />4.9</span></div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">{salons[0]!.slots.map((s) => <span key={s} className="type-label rounded-full bg-secondary px-2.5 py-1">{s}</span>)}</div>
              </div>
            </div>
          </Float>
          <Float depth={-0.6} mx={mx} my={my} delay={1.05} className="right-0 top-12">
            <div className="w-60 rounded-2xl bg-plum p-4 text-cream shadow-float">
              <div className="type-label flex items-center gap-2 opacity-80"><LayoutDashboard className="h-3.5 w-3.5" /> Admin · Today</div>
              <div className="mt-3 flex items-end gap-1.5">{[40, 64, 52, 80, 70, 92, 60].map((h, i) => <span key={i} style={{ height: h * 0.5 }} className="w-full rounded-sm bg-blush/70" />)}</div>
              <p className="type-label mt-2.5 opacity-70">Sample bookings across salons</p>
            </div>
          </Float>
          <Float depth={-0.3} mx={mx} my={my} delay={1.2} className="bottom-6 left-2">
            <div className="glass flex w-60 items-start gap-3 rounded-2xl p-3.5 shadow-soft">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mod-support/20 text-mod-support"><Headphones className="h-4 w-4" /></span>
              <div className="type-ui"><p className="font-medium">Support · Live</p><p className="mt-0.5 font-normal text-muted-foreground">"Can I move my facial to 4pm?"</p></div>
            </div>
          </Float>
          <Float depth={-0.5} mx={mx} my={my} delay={1.35} className="bottom-12 right-0">
            <div className="w-52 rounded-2xl bg-pure p-3.5 shadow-soft">
              <div className="type-ui flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-mod-web" /> November</div>
              <div className="type-label mt-2.5 grid grid-cols-7 gap-1 text-center">
                {Array.from({ length: 14 }, (_, i) => <span key={i} className={`rounded py-1 ${i === 9 ? "bg-rose text-pure" : "bg-muted"}`}>{i + 8}</span>)}
              </div>
            </div>
          </Float>
          <Float depth={-0.8} mx={mx} my={my} delay={1.6} className="right-[4%] top-[46%]">
            <div className="type-ui glass flex items-center gap-2 rounded-full px-3.5 py-2 shadow-soft"><Bell className="h-3.5 w-3.5 text-rose" /> Booking confirmed</div>
          </Float>

          <Float depth={0.25} mx={mx} my={my} delay={0.4} className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
              <Phone className="w-[230px]">
                <div className="px-4 pt-4">
                  <p className="type-label text-muted-foreground">Good morning, Sara</p>
                  <p className="type-card mt-0.5 leading-tight">Find your glow</p>
                  <div className="type-label mt-3 flex flex-wrap gap-1.5">{["Hair", "Nails", "Spa", "Makeup"].map((t, i) => <span key={t} className={`rounded-full px-2.5 py-1 ${i === 2 ? "bg-plum text-cream" : "bg-secondary"}`}>{t}</span>)}</div>
                  {salons.map((s) => (
                    <div key={s.id} className="mt-3 flex gap-2.5 rounded-xl bg-pure p-2 shadow-soft">
                      <img src={s.img} alt="" width={1024} height={768} className="h-12 w-12 rounded-lg object-cover" />
                      <div className="type-ui min-w-0"><p className="truncate font-medium">{s.name}</p><p className="font-normal text-muted-foreground">{s.area} · ★ {s.rating}</p></div>
                    </div>
                  ))}
                </div>
              </Phone>
            </motion.div>
          </Float>
        </div>
      </div>
    </section>
    </MotionConfig>
  );
}
