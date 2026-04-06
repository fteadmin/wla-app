"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <span
          className="font-display text-xl font-bold text-primary cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          WLA
        </span>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo("about")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</button>
          <button onClick={() => scrollTo("membership")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Membership</button>
          <button onClick={() => scrollTo("features")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</button>
          <button onClick={() => router.push("/contact")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => router.push("/login")}>Login</Button>
          <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 ml-2" onClick={() => router.push("/signup")}>Sign Up</Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
              <button onClick={() => scrollTo("about")} className="text-left text-muted-foreground hover:text-foreground">About</button>
              <button onClick={() => scrollTo("membership")} className="text-left text-muted-foreground hover:text-foreground">Membership</button>
              <button onClick={() => scrollTo("features")} className="text-left text-muted-foreground hover:text-foreground">Features</button>
              <button onClick={() => { setOpen(false); router.push("/contact"); }} className="text-left text-muted-foreground hover:text-foreground">Contact</button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => router.push("/login")}>Login</Button>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={() => router.push("/signup")}>Sign Up</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
