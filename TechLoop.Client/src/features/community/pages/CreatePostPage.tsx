import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CreatePostForm from "../components/CreatePostForm";

export default function CreatePostPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-full bg-[#081423]">
            <div className="mx-auto max-w-3xl px-5 py-8 sm:px-6">
                <button
                    type="button"
                    onClick={() =>
                        navigate("/learner/community")
                    }
                    className="inline-flex items-center gap-2 text-sm text-[#7189a8] transition hover:text-white"
                >
                    <ArrowLeft size={16} />
                    Back to community
                </button>

                <div className="mt-6">
                    <CreatePostForm />
                </div>
            </div>
        </div>
    );
}