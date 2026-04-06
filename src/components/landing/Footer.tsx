const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-display text-xl font-bold text-primary mb-3">WLA</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              World Lowrider Association — uniting lowrider culture worldwide.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-3">Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#about">About</a></li>
              <li><a href="#membership">Membership</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/privacy-choices">Privacy Choices</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} World Lowrider Association. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
