import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import MembershipSection from "@/components/landing/MembershipSection";
import PreviewSection from "@/components/landing/PreviewSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div id="about"><AboutSection /></div>
      <div id="membership"><MembershipSection /></div>
      <div id="features"><PreviewSection /></div>
      <Footer />
    </div>
  );
};

export default Index;
