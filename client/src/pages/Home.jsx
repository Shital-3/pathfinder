import Hero from "../components/home/Hero";
import StatsStrip from "../components/home/StatsStrip";
import FeaturedDilemmas from "../components/home/FeaturedDilemmas";
import ContextSection from "../components/home/ContextSection";


export default function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <FeaturedDilemmas />
      <ContextSection />
     
    </>
  );
}