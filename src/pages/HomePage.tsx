import HeroSection from "../sections/HeroSection";
import StudioIntroSection from "../sections/StudioIntroSection";
import StudioSection from "../sections/StudioSection";
import PortfolioSection from "../sections/PortfolioSection";
import AboutSection from "../sections/AboutSection";
import FaqSection from "../sections/FaqSection";
import ContactSection from "../sections/ContactSection";

function HomePage() {
  return (
    <>
      <HeroSection />
      <StudioIntroSection />
      <PortfolioSection />
      <StudioSection />
      <AboutSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}

export default HomePage;
