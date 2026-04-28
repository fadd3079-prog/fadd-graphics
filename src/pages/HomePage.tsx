import HeroSection from "../sections/HeroSection";
import ProfileIntroSection from "../sections/ProfileIntroSection";
import ServicesProcessSection from "../sections/ServicesProcessSection";
import PortfolioSection from "../sections/PortfolioSection";
import AboutSection from "../sections/AboutSection";
import FaqSection from "../sections/FaqSection";
import ContactSection from "../sections/ContactSection";

function HomePage() {
  return (
    <>
      <HeroSection />
      <ProfileIntroSection />
      <PortfolioSection />
      <ServicesProcessSection />
      <AboutSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}

export default HomePage;
