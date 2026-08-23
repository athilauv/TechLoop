import Hero from "../components/Hero";
import ProblemSection from "../components/ProblemSection";
import EcosystemSection from "../components/EcosystemSection";
import JourneySection from "../components/JourneySection";
import CommunitySection from "../components/CommunitySection";
import AIAndMentorSection from "../components/AIAndMentorSection";
import ContributionSection from "../components/ContributionSection";
import FinalCTA from "../components/FinalCTA";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#081423] font-sans">
            <Hero />
            <ProblemSection />
            <EcosystemSection />
            <JourneySection />
            <CommunitySection />
            <AIAndMentorSection />
            <ContributionSection />
            <FinalCTA />
        </div>
    );
}
