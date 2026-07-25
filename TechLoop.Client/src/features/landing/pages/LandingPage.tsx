import React from "react";
import Hero from "./LandingPageContents/Hero.tsx";
import Metrics from "./LandingPageContents/Metrics.tsx";
import Features from "./LandingPageContents/Features.tsx";

const LandingPage: React.FC = () => {
    return (
        <div className="bg-bg min-h-screen font-sans">
            <Hero />
            <Metrics />
            <Features />
        </div>
    );
};

export default LandingPage;