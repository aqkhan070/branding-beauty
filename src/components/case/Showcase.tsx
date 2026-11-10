import { useRef } from "react";
import { gsap } from "gsap";
import { Headphones } from "lucide-react";
import { useGsap } from "./useGsap";
import { Browser, Phone } from "./Devices";
import { salons } from "./data";
import portrait from "@/assets/beauty-portrait.jpg";

export function Showcase() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, (el) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top 70%", toggleActions: "restart none none reverse" },
    });
    tl.fromTo("[data-phone]", { scale: 1.5, xPercent: 0 }, { scale: 1, xPercent: -95, duration: 1 })
      .from("[data-desk]", { opacity: 0, x: 200, duration: 1 }, "-=0.6")
      .from("[data-web]", { opacity: 0, y: 160, duration: 0.8 })
      .from("[data-cs]", { opacity: 0, y: -120, duration: 0.8 }, "<0.2");
  });

  return (
    <section ref={ref} className="bg-blush-glow bg-secondary/40">
      <div data-pin className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <div className="absolute left-6 top-16 text-left md:left-10 lg:left-16">
          <h2 className="type-section">One Experience. Across Every Screen.</h2>
        </div>
        <div className="relative mt-24 h-[520px] w-full max-w-6xl">
          <div data-desk className="absolute left-[30%] top-6 w-[58%]">
            <Browser url="admin.beautyhub.demo">
              <div className="type-ui grid grid-cols-4 gap-3 p-4">
                {["Bookings today", "Active salons", "New clients", "Open tickets"].map((k) => <div key={k} className="rounded-lg bg-muted p-3"><p className="type-label font-normal text-muted-foreground">{k}</p><p className="type-card mt-1">—</p></div>)}
                <div className="col-span-3 flex h-36 items-end gap-1.5 rounded-lg border border-border p-3">{[40, 60, 45, 75, 55, 88, 70, 92, 66, 80].map((h, i) => <span key={i} className="flex-1 rounded-t bg-mauve/60" style={{ height: `${h}%` }} />)}</div>
                <div className="space-y-1.5 font-normal">{salons.map((s) => <div key={s.id} className="truncate rounded-md bg-blush/40 px-2.5 py-2">{s.name}</div>)}</div>
              </div>
            </Browser>
          </div>
          <div data-web className="absolute bottom-0 left-[44%] w-[34%]">
            <Browser url="book.beautyhub.demo">
              <div className="flex gap-3 p-3.5"><img src={portrait} alt="Beauty campaign portrait" width={768} height={1024} loading="lazy" className="h-28 w-24 rounded-lg object-cover" /><div className="min-w-0"><p className="type-card leading-tight">Glow, booked in seconds.</p><div className="type-ui mt-3 inline-block rounded-full bg-plum px-3.5 py-1.5 text-cream">Find a salon</div></div></div>
            </Browser>
          </div>
          <div data-cs className="absolute right-0 top-0 w-60">
            <div className="type-ui rounded-2xl bg-pure p-3.5 shadow-float">
              <div className="flex items-center gap-2"><Headphones className="h-4 w-4 text-mod-support" /> Live support</div>
              <div className="mt-2.5 rounded-lg bg-muted p-2.5 font-normal">"Can I add a manicure?"</div>
              <div className="ml-6 mt-2 rounded-lg bg-mod-support/20 p-2.5 font-normal">"Done — added for 14:00 ✓"</div>
            </div>
          </div>
          <div data-phone className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Phone className="w-[220px]">
              <img src={portrait} alt="" width={768} height={1024} loading="lazy" className="h-44 w-full object-cover" />
              <div className="p-3.5"><p className="type-card">Your next ritual</p><p className="type-ui mt-1 font-normal text-muted-foreground">Facial · Glow Studio · Thu 13:00</p><div className="type-ui mt-3 rounded-full bg-rose py-2.5 text-center text-pure">Manage booking</div></div>
            </Phone>
          </div>
        </div>
      </div>
    </section>
  );
}
