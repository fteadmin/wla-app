"use client";
import Navbar from "../src/components/landing/Navbar";
import HeroSection from "../src/components/landing/HeroSection";
import AboutSection from "../src/components/landing/AboutSection";
import MembershipSection from "../src/components/landing/MembershipSection";
import PreviewSection from "../src/components/landing/PreviewSection";
import AppSection from "../src/components/landing/AppSection";
import Footer from "../src/components/landing/Footer";

export default function Home() {
	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<HeroSection />
			<div id="app"><AppSection /></div>
			<div id="about"><AboutSection /></div>
			<div id="membership"><MembershipSection /></div>
			<div id="features"><PreviewSection /></div>
			<Footer />
		</div>
	);
}