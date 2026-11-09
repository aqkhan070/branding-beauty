import { useState } from "react";
import { motion } from "motion/react";
import { Mail, MessageCircle } from "lucide-react";
import { SectionHead } from "./Devices";

const Ig = () => <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>;
const Fb = () => <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v7h4v-7h3l1-4h-4V8z" /></svg>;
const Tt = () => <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M16 3c.4 2.3 1.9 3.8 4 4v3.2a7 7 0 0 1-4-1.3V15a6 6 0 1 1-6-6v3.3a2.8 2.8 0 1 0 2.8 2.7V3H16z" /></svg>;

const channels = [
  { k: "ig", name: "Instagram", Icon: Ig, cls: "bg-ig", msg: "DM: \"Love this balayage! Any slots Friday?\"", flow: "Reply with salon profile link" },
  { k: "fb", name: "Facebook & Meta", Icon: Fb, cls: "bg-fb", msg: "Comment: \"Do you do bridal packages?\"", flow: "Inquiry routed to support team" },
  { k: "tt", name: "TikTok", Icon: Tt, cls: "bg-tt", msg: "Video view → profile visit", flow: "Discovery leads to salon page" },
  { k: "wa", name: "WhatsApp", Icon: () => <MessageCircle className="h-6 w-6" />, cls: "bg-wa", msg: "\"Can I move my 3pm to 4pm?\"", flow: "Confirmations & reminders" },
  { k: "mail", name: "Email", Icon: () => <Mail className="h-6 w-6" />, cls: "bg-mail", msg: "Booking confirmation · Glow Studio", flow: "Confirmations & reminders" },
];

export function Integrations() {
  const [active, setActive] = useState(0);
  const a = channels[active];
  return (
    <section className="relative overflow-hidden bg-background py-32">
      <SectionHead eyebrow="05 — Channels" title="Connected Wherever Your Customers Are." sub="Social touchpoints and messaging feed into one place — from first inquiry to salon discovery." />

      <div className="mx-auto mt-16 grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-[18%] rounded-full border border-dashed border-rose/40" />
          <div className="absolute inset-[4%] rounded-full border border-blush" />
          <div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-plum text-center text-cream shadow-float">
            <p className="font-display text-xl leading-tight">Beauty<br />Hub</p>
          </div>
          {channels.map((c, i) => {
            const ang = (i / channels.length) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + Math.cos(ang) * 42, y = 50 + Math.sin(ang) * 42;
            return (
              <motion.button key={c.k} onClick={() => setActive(i)} style={{ left: `${x}%`, top: `${y}%` }}
                whileHover={{ scale: 1.12 }} animate={{ scale: active === i ? 1.15 : 1 }}
                className={`absolute grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl text-pure shadow-soft ring-offset-4 ring-offset-background ${c.cls} ${active === i ? "ring-2 ring-rose" : ""}`}
                aria-label={c.name}>
                <c.Icon />
              </motion.button>
            );
          })}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100">
            {(() => { const ang = (active / channels.length) * Math.PI * 2 - Math.PI / 2; return (
              <motion.line key={active} x1={50 + Math.cos(ang) * 34} y1={50 + Math.sin(ang) * 34} x2={50 + Math.cos(ang) * 10} y2={50 + Math.sin(ang) * 10}
                stroke="var(--rose)" strokeWidth="0.6" strokeDasharray="2 2" className="dash-flow" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
            ); })()}
          </svg>
        </div>

        <div>
          <motion.div key={a.k} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <p className="eyebrow">{a.name}</p>
            <div className="mt-4 rounded-2xl bg-pure p-5 shadow-soft">
              <div className="flex items-center gap-3"><span className={`grid h-9 w-9 place-items-center rounded-xl text-pure ${a.cls}`}><a.Icon /></span><p className="text-sm">{a.msg}</p></div>
              <div className="my-4 ml-4 h-8 w-px bg-rose/50" />
              <div className="rounded-xl bg-secondary px-4 py-3 text-sm"><span className="text-muted-foreground">Then → </span>{a.flow}</div>
            </div>
          </motion.div>
          <p className="mt-4 text-xs text-muted-foreground">Shows communication and engagement flows; bookings complete in the app or web platform.</p>
        </div>
      </div>

      <div className="mt-20 overflow-hidden">
        <div className="marquee flex w-max gap-4">
          {[...channels, ...channels, ...channels, ...channels].map((c, i) => (
            <div key={i} className="flex items-center gap-3 rounded-full bg-pure px-4 py-2 text-sm shadow-soft">
              <span className={`h-2.5 w-2.5 rounded-full ${c.cls}`} />{c.msg}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
