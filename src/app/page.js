import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Hero from "@/components/site/Hero";
import HowItWorks from "@/components/site/HowItWorks";
import Features from "@/components/site/Features";
import RolesSection from "@/components/site/RolesSection";
import CTASection from "@/components/site/CTASection";
import FAQSection from "@/components/site/FAQSection";

export default function Home() {
  return (
    <div className="site">
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <RolesSection />
        <CTASection />
        <FAQSection />
      </main>
      <SiteFooter />
    </div>
  );
}
