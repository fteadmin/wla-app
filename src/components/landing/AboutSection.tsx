import { motion } from "framer-motion";

const moments = [
  {
    title: "Street Showcases",
    image:
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Build Details",
    image:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Event Days",
    image:
      "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&w=1200&q=80",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-16">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <div className="overflow-hidden rounded-3xl border border-border/60">
              <img
                src="https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=1400&q=80"
                alt="Lowrider culture gathering"
                className="h-[460px] w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-5 left-5 rounded-xl border border-border bg-background/80 px-4 py-3 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Since Day One</p>
              <p className="text-sm text-foreground">Keeping the craft authentic, global, and community-led.</p>
            </div>
          </motion.div>

          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <p className="text-primary tracking-[0.2em] uppercase text-sm font-medium mb-4">
              About WLA
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-foreground">
              More Than a Club. <span className="text-primary">A Movement.</span>
            </h2>
            <p className="text-secondary text-lg leading-relaxed mb-6">
              The World Lowrider Association is dedicated to preserving and elevating lowrider
              culture worldwide. We bring together builders, collectors, and enthusiasts under
              one unified platform, celebrating artistry, heritage, and community.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {moments.map((item) => (
                <div key={item.title} className="rounded-xl border border-border/70 bg-card/40 p-2">
                  <img src={item.image} alt={item.title} className="h-24 w-full rounded-md object-cover" loading="lazy" />
                  <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{item.title}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <stat.icon className="h-8 w-8 text-primary mx-auto mb-4" />
              <p className="font-display text-4xl font-bold text-foreground mb-2">{stat.value}</p>
              <p className="text-muted-foreground text-sm uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default AboutSection;
