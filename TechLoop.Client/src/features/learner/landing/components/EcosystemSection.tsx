import EcosystemGraph from "./EcosystemGraph";
import SectionReveal from "./SectionReveal";

export default function EcosystemSection() {
    return (
        <section
            id="ecosystem"
            className="relative px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
        >
            <div className="mx-auto max-w-4xl text-center">
                <SectionReveal>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#17D4C3]">
                        One ecosystem
                    </span>
                    <h2 className="mt-3 text-2xl font-bold text-[#e8f0fe] sm:text-3xl lg:text-4xl">
                        Everything is connected.
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#8ca3bf]">
                        Hover a node to see how it fits into the loop. Nothing here is
                        siloed — your progress in one carries into the next.
                    </p>
                </SectionReveal>
            </div>

            <SectionReveal delay={0.1} className="mt-16 flex justify-center pb-16">
                <EcosystemGraph size={480} interactive />
            </SectionReveal>
        </section>
    );
}
