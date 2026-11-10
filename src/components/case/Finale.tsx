import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export function Finale() {
  return (
    <section className="grain relative overflow-hidden bg-plum-gradient px-6 py-40 text-center text-cream">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20%" }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} className="mx-auto max-w-4xl">
        <p className="eyebrow text-blush">07 — Case Study</p>
        <h2 className="type-hero mt-6">Building the Future of <em className="text-blush">Beauty Experiences.</em></h2>
        <p className="type-body mx-auto mt-8 max-w-xl opacity-85">A connected platform designed to simplify appointments, empower salon teams and create effortless customer experiences.</p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a href="#" className="type-nav group inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-3.5 transition hover:bg-cream hover:text-plum">View More Projects <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" /></a>
          <a href="mailto:hello@example.com?subject=Similar%20project" className="type-nav group inline-flex items-center gap-2 rounded-full bg-blush px-7 py-3.5 text-plum transition hover:bg-cream">Discuss a Similar Project <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" /></a>
        </div>
      </motion.div>
      <p className="type-label mt-32 opacity-55">All salon names, people and figures shown are illustrative sample data.</p>
    </section>
  );
}
