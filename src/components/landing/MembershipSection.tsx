import { motion } from "framer-motion";
import { Check, Crown, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const tiers = [
  {
    name: "Basic Member",
    price: "$20 per year",
    period: "",
    icon: Shield,
    description: "Your gateway into the WLA community",
    features: [
      "Full platform access",
      "Digital membership card & QR code",
      "Unique WLA Membership ID",
      "Marketplace access",
      "Contest participation",
      "BLVD Token purchases",
    ],
    cta: "Join Now",
    featured: true,
    purchasable: true,
  },
  {
    name: "Founding Member",
    price: "Invite Only",
    period: "",
    icon: Crown,
    description: "Reserved for original WLA founders",
    features: [
      "All Basic benefits",
      "Founding Member badge",
      "Priority contest entry",
      "Exclusive events access",
      "Bonus token rewards",
      "Direct admin access",
    ],
    cta: "By Invitation",
    featured: false,
    purchasable: false,
  },
  {
    name: "Legacy Member",
    price: "Earned",
    period: "",
    icon: Star,
    description: "Awarded for outstanding contributions",
    features: [
      "All Founding benefits",
      "Legacy Member badge",
      "Lifetime membership",
      "VIP event access",
      "Custom profile features",
      "Community leadership role",
    ],
    cta: "Recognition Based",
    featured: false,
    purchasable: false,
  },
];

const MembershipSection = () => {
  const navigate = useNavigate();

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
            Membership
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Choose Your <span className="text-primary">Path</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              className={`relative rounded-2xl p-8 border transition-all duration-300 ${
                tier.featured
                  ? "border-primary/50 bg-card shadow-[0_0_40px_hsl(38_46%_68%_/_0.1)]"
                  : "border-border bg-card/50"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <tier.icon className={`h-8 w-8 mb-4 ${tier.featured ? "text-primary" : "text-muted-foreground"}`} />
              <h3 className="font-display text-2xl font-bold text-foreground mb-1">{tier.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{tier.description}</p>
              <div className="mb-6">
                <span className="font-display text-3xl font-bold text-foreground">{tier.price}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-secondary">{f}</span>
                  </li>
                ))}
              </ul>
              {tier.purchasable ? (
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_hsl(38_46%_68%_/_0.2)]"
                  onClick={() => navigate("/auth")}
                >
                  {tier.cta}
                </Button>
              ) : (
                <Button variant="outline" className="w-full border-border text-muted-foreground" disabled>
                  {tier.cta}
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;
