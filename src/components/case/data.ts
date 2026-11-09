import glow from "@/assets/salon-glow.jpg";
import muse from "@/assets/salon-muse.jpg";
import aura from "@/assets/salon-aura.jpg";

// Illustrative sample data only — not real businesses or metrics.
export const salons = [
  { id: "glow", name: "Glow Studio", area: "Downtown", rating: 4.9, img: glow, tags: ["Facial", "Spa"], slots: ["10:30", "13:00", "16:15"] },
  { id: "muse", name: "Muse Beauty Lounge", area: "Riverside", rating: 4.8, img: muse, tags: ["Makeup", "Nails"], slots: ["11:00", "14:30", "17:45"] },
  { id: "aura", name: "Aura Hair Salon", area: "Old Town", rating: 4.7, img: aura, tags: ["Hair", "Color"], slots: ["09:45", "12:15", "15:30"] },
];

export const services = [
  { name: "Hair Styling", dur: "60 min" },
  { name: "Hair Coloring", dur: "120 min" },
  { name: "Makeup", dur: "45 min" },
  { name: "Facial", dur: "50 min" },
  { name: "Manicure & Pedicure", dur: "75 min" },
  { name: "Spa Treatments", dur: "90 min" },
];

export const sampleNote = "Illustrative sample data";
