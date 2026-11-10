import { useEffect, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bell,
  CalendarDays,
  Check,
  MapPin,
  MessageSquare,
  RefreshCw,
  UserRound,
} from "lucide-react";
import patientPortrait from "@/assets/beauty-portrait.jpg";

const ease = [0.22, 1, 0.36, 1] as const;
const BURGUNDY = "#630d16";

/* —— Real brand channel icons —— */
function IgIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <radialGradient id="ig-g" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-g)" />
      <rect x="5.2" y="5.2" width="13.6" height="13.6" rx="4" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.6" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="16.6" cy="7.4" r="1.15" fill="#fff" />
    </svg>
  );
}

function FbIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {/* Official Meta Facebook mark */}
      <path
        fill="#1877F2"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}

function WaIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect width="24" height="24" rx="6" fill="#25D366" />
      <path
        fill="#fff"
        d="M12.04 4.35a7.45 7.45 0 0 0-6.45 11.25L4.85 19.65l4.15-.8A7.45 7.45 0 1 0 12.04 4.35zm4.35 10.6c-.18.51-.9.94-1.33 1.06-.36.1-.82.18-2.35-.49-1.96-.86-3.23-2.96-3.33-3.1-.1-.14-.82-1.08-.82-2.06s.51-1.46.7-1.66c.16-.19.36-.23.49-.23h.36c.11 0 .26-.04.41.31.18.45.62 1.5.67 1.6.06.1.09.22.02.36-.07.14-.1.23-.2.35-.1.11-.21.25-.3.34-.1.1-.2.21-.08.4.12.19.53.88 1.14 1.42.79.7 1.45.92 1.65 1.02.2.1.32.09.44-.05.12-.14.51-.59.64-.8.14-.2.28-.16.46-.1.18.07 1.17.55 1.38.65.2.1.34.15.39.24.05.08.05.49-.13 1z"
      />
    </svg>
  );
}

function MailIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect width="24" height="24" rx="6" fill="#EA4335" />
      <path
        d="M5.2 7.6c0-.55.45-1 1-1h11.6c.55 0 1 .45 1 1v8.8c0 .55-.45 1-1 1H6.2c-.55 0-1-.45-1-1V7.6z"
        fill="#fff"
      />
      <path d="M5.6 7.9 12 13.1l6.4-5.2" fill="none" stroke="#EA4335" strokeWidth="1.55" strokeLinejoin="round" />
      <path d="M5.6 16.1 10.2 12.2M18.4 16.1 13.8 12.2" fill="none" stroke="#EA4335" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function WebIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect width="24" height="24" rx="6" fill="#5B6CFF" />
      <rect x="6.2" y="5.5" width="11.6" height="13" rx="2.2" fill="#fff" />
      <rect x="7.4" y="7" width="9.2" height="7.2" rx="1" fill="#E8ECFF" />
      <circle cx="12" cy="16.4" r="0.85" fill="#5B6CFF" />
      <path d="M10.2 16.4h3.6" stroke="#5B6CFF" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/** Seconds for one full orbit revolution */
const ORBIT_SPIN_S = 36;

/** Friendly 3D-style robot doctor matching the reference look */
function DoctorAvatar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden>
      <defs>
        <linearGradient id="doc-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#f3e8ec" />
        </linearGradient>
        <linearGradient id="doc-coat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#f7eef1" />
        </linearGradient>
        <radialGradient id="doc-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#f8d5de" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f8d5de" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="110" r="88" fill="url(#doc-glow)" />
      {/* torso / coat */}
      <path
        d="M48 168c8-28 28-42 52-42s44 14 52 42v36H48v-36z"
        fill="url(#doc-coat)"
        stroke="#e8d0d8"
        strokeWidth="1.2"
      />
      <path d="M100 126v78" stroke={BURGUNDY} strokeWidth="1.4" opacity="0.35" />
      {/* arms */}
      <ellipse cx="46" cy="168" rx="14" ry="18" fill="#fff" stroke="#e8d0d8" strokeWidth="1" />
      <ellipse cx="154" cy="168" rx="14" ry="18" fill="#fff" stroke="#e8d0d8" strokeWidth="1" />
      {/* waving hand */}
      <g transform="translate(150 132) rotate(-18)">
        <ellipse cx="0" cy="0" rx="11" ry="14" fill="#fff" stroke="#e8d0d8" strokeWidth="1" />
        <path d="M-4 -8v-10M0 -9v-12M4 -8v-10" stroke="#e8d0d8" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      {/* stethoscope */}
      <path
        d="M72 138c0 18 12 30 28 30s28-12 28-30"
        fill="none"
        stroke={BURGUNDY}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="100" cy="172" r="9" fill={BURGUNDY} />
      <path d="M95 172h10" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M97 169c2-3 4-3 6 0" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      {/* head */}
      <ellipse cx="100" cy="78" rx="42" ry="46" fill="url(#doc-body)" stroke="#ead6dd" strokeWidth="1.2" />
      {/* headphones */}
      <path d="M58 78c0-28 18-48 42-48s42 20 42 48" fill="none" stroke={BURGUNDY} strokeWidth="7" strokeLinecap="round" />
      <rect x="48" y="68" width="16" height="28" rx="8" fill={BURGUNDY} />
      <rect x="136" y="68" width="16" height="28" rx="8" fill={BURGUNDY} />
      <circle cx="56" cy="82" r="5" fill="#4a0a10" opacity="0.35" />
      <circle cx="144" cy="82" r="5" fill="#4a0a10" opacity="0.35" />
      {/* face screen */}
      <rect x="74" y="62" width="52" height="38" rx="14" fill={BURGUNDY} />
      <path d="M84 76c4-5 8-5 12 0" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M104 76c4-5 8-5 12 0" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M90 88c4 5 12 5 16 0" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function AiBubbleAvatar() {
  return (
    <div
      className="grid h-8 w-8 shrink-0 place-items-center rounded-full shadow-sm"
      style={{ background: "linear-gradient(145deg, #f3c9d4, #e8a8b8)" }}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <rect x="5" y="6" width="14" height="12" rx="4" fill={BURGUNDY} />
        <path d="M8.5 11c1.2-1.5 2.3-1.5 3.5 0" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M12.5 11c1.2-1.5 2.3-1.5 3.5 0" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M10 14.5c1.2 1.3 2.8 1.3 4 0" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

type ChannelKey = "ig" | "fb" | "wa" | "mail" | "web";

type Channel = {
  key: ChannelKey;
  name: string;
  Icon: ComponentType<{ className?: string }>;
  angle: number;
  labelSide: "top" | "bottom";
  time: string;
  messages: [string, string, string];
};

const channels: Channel[] = [
  {
    key: "ig",
    name: "Instagram",
    Icon: IgIcon,
    angle: -90,
    labelSide: "top",
    time: "Today, 10:24 AM",
    messages: [
      "Hi! Do you have a dermatologist appointment this week?",
      "Yes! Dr. Sara is available on Friday at 4:00 PM. Would you like me to book it for you?",
      "Yes, please!",
    ],
  },
  {
    key: "fb",
    name: "Facebook",
    Icon: FbIcon,
    angle: -18,
    labelSide: "top",
    time: "Today, 11:02 AM",
    messages: [
      "Hello — looking for a dermatology consult this week.",
      "Dr. Sara has an opening Friday at 4:00 PM. Shall I reserve it?",
      "Perfect, book it!",
    ],
  },
  {
    key: "web",
    name: "Website / App",
    Icon: WebIcon,
    angle: 54,
    labelSide: "bottom",
    time: "Today, 2:18 PM",
    messages: [
      "Can I see a dermatologist before the weekend?",
      "Yes — Dr. Sara is free Friday at 4:00 PM. Want me to confirm?",
      "Yes, please confirm.",
    ],
  },
  {
    key: "wa",
    name: "WhatsApp",
    Icon: WaIcon,
    angle: 126,
    labelSide: "bottom",
    time: "Today, 9:41 AM",
    messages: [
      "Hi, any dermatologist slots left this week?",
      "Dr. Sara is available Friday at 4:00 PM. Should I book that for you?",
      "Yes please!",
    ],
  },
  {
    key: "mail",
    name: "Email",
    Icon: MailIcon,
    angle: 198,
    labelSide: "top",
    time: "Today, 8:15 AM",
    messages: [
      "I'd like to book a dermatology appointment this week.",
      "Dr. Sara can see you Friday at 4:00 PM. Shall I schedule it?",
      "Yes, that works — please book.",
    ],
  },
];

const features = [
  {
    Icon: MessageSquare,
    title: "All Channels in One Place",
    desc: "Manage calls, chats and inquiries effortlessly.",
  },
  {
    Icon: CalendarDays,
    title: "Smart Bookings",
    desc: "Real-time availability and automatic confirmations.",
  },
  {
    Icon: Bell,
    title: "Instant Notifications",
    desc: "Appointment reminders for patients and clinic staff.",
  },
  {
    Icon: RefreshCw,
    title: "Health Journey, In Sync",
    desc: "Every interaction, booking and update is saved to the patient's record.",
  },
];

/** Orbit radius as % of container */
const ORBIT_R = 42;

function polar(angleDeg: number, r = ORBIT_R) {
  const rad = (angleDeg * Math.PI) / 180;
  return { left: `${50 + Math.cos(rad) * r}%`, top: `${50 + Math.sin(rad) * r}%` };
}

/**
 * Timing per channel cycle (~5.2s):
 * activate → msg1 → msg2 → msg3 → confirmation → hold → next
 * Channel highlight advances with each cycle (~every 5s; beats feel ~2s apart).
 */
/* Channel advances ~every 3.5s (~2s of chat, then confirmation hold) */
const MSG_DELAYS = [280, 750, 1200] as const;
const CONFIRM_AT = 1700;
const CYCLE_MS = 3500;

export function Integrations() {
  const [active, setActive] = useState(0);
  const [visibleMsgs, setVisibleMsgs] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setVisibleMsgs(0);
    setShowConfirm(false);

    const timers = [
      window.setTimeout(() => setVisibleMsgs(1), MSG_DELAYS[0]),
      window.setTimeout(() => setVisibleMsgs(2), MSG_DELAYS[1]),
      window.setTimeout(() => setVisibleMsgs(3), MSG_DELAYS[2]),
      window.setTimeout(() => setShowConfirm(true), CONFIRM_AT),
      window.setTimeout(() => setActive((i) => (i + 1) % channels.length), CYCLE_MS),
    ];
    return () => timers.forEach(clearTimeout);
  }, [active]);

  const channel = channels[active]!;

  return (
    <section
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, #fce8ee 0%, transparent 55%), linear-gradient(180deg, #fff8fa 0%, #ffffff 45%, #fff6f8 100%)",
      }}
    >
      {/* soft atmosphere */}
      <div
        className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: "#f5c6d2" }}
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-32 h-64 w-64 rounded-full opacity-30 blur-3xl"
        style={{ background: "#e8b8c8" }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.28em] md:text-xs"
            style={{ color: "#9a6b76" }}
          >
            Omnichannel Care
          </p>
          <h2
            className="mt-4 text-[1.85rem] font-semibold leading-[1.15] tracking-tight md:text-[2.75rem] lg:text-[3.15rem]"
            style={{ fontFamily: "var(--font-sans)", color: "#2a1a1e" }}
          >
            Stay Connected with{" "}
            <span style={{ color: BURGUNDY }}>Your Patients, Everywhere.</span>
          </h2>
          <p
            className="mx-auto mt-5 max-w-xl text-[0.95rem] leading-relaxed md:text-base"
            style={{ color: "#7a5a64" }}
          >
            Bring all patient conversations, inquiries and bookings into one unified platform — from
            first question to confirmed appointment.
          </p>
        </div>

        {/* Interactive stage */}
        <div className="relative mt-14 grid items-center gap-8 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_minmax(0,0.85fr)] lg:gap-x-14 lg:gap-y-8 xl:gap-x-20">
          {/* Left: avatar + orbit */}
          <div className="relative mx-auto aspect-square w-full max-w-[360px] lg:max-w-none lg:mr-2 xl:mr-4">
            <div
              className="absolute inset-[12%] rounded-full border"
              style={{ borderColor: "color-mix(in oklab, #e8b0c0 55%, transparent)" }}
            />
            <div
              className="absolute inset-[4%] rounded-full border border-dashed"
              style={{ borderColor: "color-mix(in oklab, #d498a8 40%, transparent)" }}
            />

            {/* Center doctor — clipped to a strict circular frame */}
            <div className="absolute left-1/2 top-1/2 z-10 aspect-square w-[54%] -translate-x-1/2 -translate-y-1/2">
              <div
                className="relative h-full w-full overflow-hidden rounded-full"
                style={{
                  background: "linear-gradient(160deg, #ffe8ef 0%, #fff 55%, #fceef2 100%)",
                  boxShadow:
                    "0 0 0 3px #fff, 0 0 0 5px color-mix(in oklab, #e8b0c0 55%, transparent), 0 22px 48px -22px rgba(99,13,22,0.38)",
                }}
              >
                <DoctorAvatar className="absolute left-1/2 top-[46%] h-[118%] w-[118%] max-w-none -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Continuously orbiting channel icons (counter-rotated so logos stay upright) */}
            <motion.div
              className="absolute inset-0 z-20"
              animate={{ rotate: 360 }}
              transition={{ duration: ORBIT_SPIN_S, repeat: Infinity, ease: "linear" }}
            >
              {channels.map((c, i) => {
                const pos = polar(c.angle);
                const isActive = i === active;
                return (
                  <div
                    key={c.key}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: pos.left, top: pos.top }}
                  >
                    <motion.div
                      className="relative"
                      animate={{ rotate: -360 }}
                      transition={{ duration: ORBIT_SPIN_S, repeat: Infinity, ease: "linear" }}
                    >
                      <motion.button
                        type="button"
                        aria-label={c.name}
                        onClick={() => setActive(i)}
                        animate={{
                          scale: isActive ? 1.14 : 1,
                          y: isActive ? -2 : 0,
                        }}
                        transition={{ duration: 0.45, ease }}
                        className="relative grid h-14 w-14 place-items-center rounded-2xl bg-white md:h-16 md:w-16"
                        style={{
                          boxShadow: isActive
                            ? "0 14px 32px -10px rgba(99,13,22,0.4), 0 0 0 2.5px color-mix(in oklab, #630d16 28%, transparent)"
                            : "0 12px 28px -10px rgba(42,26,30,0.26)",
                        }}
                      >
                        <c.Icon className="h-8 w-8 md:h-9 md:w-9" />
                      </motion.button>
                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            key={`label-${c.key}`}
                            initial={{ opacity: 0, y: c.labelSide === "top" ? 6 : -6, scale: 0.92 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            transition={{ duration: 0.35, ease }}
                            className={`absolute left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 text-[11px] font-semibold shadow-md md:text-xs ${
                              c.labelSide === "top" ? "bottom-[calc(100%+10px)]" : "top-[calc(100%+10px)]"
                            }`}
                            style={{ color: "#2a1a1e" }}
                          >
                            {c.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Center: conversation */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={channel.key}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.45, ease }}
                className="rounded-[1.75rem] border border-white/80 bg-white p-5 shadow-[0_24px_60px_-28px_rgba(99,13,22,0.28)] md:p-6"
              >
                <div className="flex items-center gap-3 border-b border-[#f0e4e8] pb-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fceef2]">
                    <channel.Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold md:text-[15px]" style={{ color: BURGUNDY }}>
                      {channel.name}
                    </p>
                    <p className="text-xs text-[#9a7a84]">{channel.time}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-4 min-h-[220px]">
                  {/* Patient msg 1 */}
                  <AnimatePresence>
                    {visibleMsgs >= 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 14, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, ease }}
                        className="flex items-end gap-2.5"
                      >
                        <img
                          src={patientPortrait}
                          alt=""
                          className="h-8 w-8 shrink-0 rounded-full object-cover object-top"
                        />
                        <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-[#f1eef0] px-3.5 py-2.5 text-[13px] leading-snug text-[#3a2a30] md:text-sm">
                          {channel.messages[0]}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* AI msg */}
                  <AnimatePresence>
                    {visibleMsgs >= 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 14, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, ease }}
                        className="flex items-end gap-2.5"
                      >
                        <AiBubbleAvatar />
                        <div
                          className="max-w-[88%] rounded-2xl rounded-bl-md px-3.5 py-2.5 text-[13px] leading-snug md:text-sm"
                          style={{ background: "#f8e6ec", color: "#3a2a30" }}
                        >
                          <span className="mb-1 block text-[11px] font-semibold" style={{ color: BURGUNDY }}>
                            AI Assistant
                          </span>
                          {channel.messages[1]}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Patient msg 3 */}
                  <AnimatePresence>
                    {visibleMsgs >= 3 && (
                      <motion.div
                        initial={{ opacity: 0, y: 14, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, ease }}
                        className="flex items-end gap-2.5"
                      >
                        <img
                          src={patientPortrait}
                          alt=""
                          className="h-8 w-8 shrink-0 rounded-full object-cover object-top"
                        />
                        <div className="rounded-2xl rounded-bl-md bg-[#f1eef0] px-3.5 py-2.5 text-[13px] leading-snug text-[#3a2a30] md:text-sm">
                          {channel.messages[2]}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* curved arrow to confirmation — desktop */}
            <svg
              className="pointer-events-none absolute -right-14 top-[42%] hidden h-14 w-20 -translate-y-1/2 lg:block xl:-right-16"
              viewBox="0 0 80 56"
              fill="none"
              aria-hidden
            >
              <motion.path
                d="M2 22 C 26 8, 50 8, 70 24"
                stroke={BURGUNDY}
                strokeWidth="1.6"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: showConfirm ? 1 : 0.35, opacity: showConfirm ? 1 : 0.35 }}
                transition={{ duration: 0.55, ease }}
              />
              <motion.path
                d="M58 16 L72 26 L58 36"
                stroke={BURGUNDY}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: showConfirm ? 1 : 0 }}
                transition={{ duration: 0.35, delay: 0.2 }}
              />
            </svg>
          </div>

          {/* Right: appointment confirmation */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none lg:min-h-[260px]">
            <AnimatePresence>
              {showConfirm && (
                <motion.div
                  key={`confirm-${channel.key}`}
                  initial={{ opacity: 0, x: 28, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 16, scale: 0.96 }}
                  transition={{ duration: 0.45, ease }}
                  className="rounded-[1.75rem] border border-white/80 bg-white p-6 shadow-[0_24px_60px_-28px_rgba(99,13,22,0.28)] lg:absolute lg:inset-x-0 lg:top-1/2 lg:-translate-y-1/2"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
                      style={{ background: BURGUNDY }}
                    >
                      <CalendarDays className="h-6 w-6 text-white" strokeWidth={1.75} />
                      <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-[#22c55e] ring-2 ring-white">
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </span>
                    </div>
                    <div>
                      <p className="text-lg font-semibold" style={{ color: BURGUNDY }}>
                        Appointment Booked
                      </p>
                      <p className="mt-0.5 text-xs text-[#9a7a84]">Synced across every channel</p>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-4">
                    {[
                      { Icon: UserRound, text: "Dr. Sara Ahmed (Dermatology)" },
                      { Icon: CalendarDays, text: "Fri, 14 Nov, 4:00 PM" },
                      { Icon: MapPin, text: "City Care Clinic" },
                    ].map(({ Icon, text }) => (
                      <li key={text} className="flex items-center gap-3 text-sm text-[#3a2a30]">
                        <span
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                          style={{ background: "#fceef2", color: BURGUNDY }}
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.85} />
                        </span>
                        {text}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Feature row */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-6">
          {features.map(({ Icon, title, desc }) => (
            <div key={title} className="text-center lg:text-left">
              <div
                className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl border lg:mx-0"
                style={{
                  background: "linear-gradient(145deg, #f9d7e1 0%, #f0b8c8 100%)",
                  borderColor: "color-mix(in oklab, #630d16 38%, transparent)",
                  color: BURGUNDY,
                  boxShadow: "0 10px 22px -10px rgba(99,13,22,0.45)",
                }}
              >
                <Icon className="h-[22px] w-[22px]" strokeWidth={1.9} />
              </div>
              <p className="text-[15px] font-semibold" style={{ color: "#2a1a1e" }}>
                {title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-[#7a5a64]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
