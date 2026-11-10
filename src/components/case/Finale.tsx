import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export function Finale() {
  return (
    <section className="bg-background px-6 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="grain relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-plum-gradient px-8 py-10 text-center text-cream md:px-14 md:py-12"
      >
        <h2 className="type-hero">Building the Future of <em className="text-blush">Beauty Experiences.</em></h2>
        <p className="type-body mx-auto mt-3 max-w-xl opacity-85">A connected platform designed to simplify appointments, empower salon teams and create effortless customer experiences.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <a href="#" className="type-nav group inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-3.5 transition hover:bg-cream hover:text-plum">View More Projects <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" /></a>
          <a href="mailto:hello@example.com?subject=Similar%20project" className="type-nav group inline-flex items-center gap-2 rounded-full bg-blush px-7 py-3.5 text-plum transition hover:bg-cream">Discuss a Similar Project <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" /></a>
        </div>
        <p className="type-label mt-6 opacity-55">All salon names, people and figures shown are illustrative sample data.</p>
      </motion.div>
    </section>
  );
}
