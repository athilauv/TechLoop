import React from "react";
import Hero from "../components/Hero.tsx";
import Metrics from "../components/Metrics.tsx";
import Features from "../components/Features.tsx";

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