import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import TopicContributionForm from "../components/TopicContributionForm.tsx";

export default function CreateTopicContributionPage() {
    const navigate = useNavigate();

    return (
        <section className="mx-auto w-full max-w-4xl">

            <button type="button" onClick={() => navigate("/learner/topic-contributions")}
                className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#8CA3BF] transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E8C2]/40 rounded">
                <ArrowLeft size={16} />
                Back to contributions
            </button>

            <TopicContributionForm />

        </section>
    );
}