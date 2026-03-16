import { motion } from "framer-motion";
import { ShoppingBag, Camera, ArrowRight } from "lucide-react";

const previews = [
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description:
      "Buy, sell, and trade lowrider parts, accessories, and custom builds with verified WLA members.",
    tag: "Coming Soon",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80",
  },
  {
    icon: Camera,
    title: "Photo Contests",
    description:
      "Compete in themed photo contests, earn BLVD tokens, and get featured across the WLA community.",
    tag: "Coming Soon",
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80",
  },
];

const PreviewSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-primary tracking-[0.2em] uppercase text-sm font-medium mb-4">
            Platform Features
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            What's <span className="text-primary">Inside</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {previews.map((item, i) => (
            <motion.div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="text-xs uppercase tracking-wider text-accent font-medium px-3 py-1 rounded-full border border-accent/30 bg-background/65 backdrop-blur-sm">
                    {item.tag}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="rounded-full border border-border bg-background/75 p-2">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-display text-xl text-foreground">{item.title}</p>
                </div>
              </div>

              <div className="p-6">
                <p className="text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreviewSection;
