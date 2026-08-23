import {
    BookOpen,
    Target,
    Code2,
    MessageSquare,
    GraduationCap,
    Sparkles,
    GitPullRequest,
    type LucideIcon,
} from "lucide-react";

export interface EcosystemNode {
    id: string;
    label: string;
    description: string;
    icon: LucideIcon;
    /** Position around the circle, in degrees, 0 = top, clockwise. */
    angle: number;
}

export const ECOSYSTEM_NODES: EcosystemNode[] = [
    {
        id: "learn",
        label: "Learn",
        description: "Structured topics and subtopics across real technologies.",
        icon: BookOpen,
        angle: 0,
    },
    {
        id: "practice",
        label: "Practice",
        description: "MCQs and guided questions to lock in what you just learned.",
        icon: Target,
        angle: 51,
    },
    {
        id: "code",
        label: "Code",
        description: "Coding challenges with real test cases and submissions.",
        icon: Code2,
        angle: 102,
    },
    {
        id: "discuss",
        label: "Discuss",
        description: "Talk through approaches with other developers, in context.",
        icon: MessageSquare,
        angle: 153,
    },
    {
        id: "mentor",
        label: "Mentor",
        description: "Get unblocked by mentors who've solved this before.",
        icon: GraduationCap,
        angle: 204,
    },
    {
        id: "ai",
        label: "AI",
        description: "An AI layer for explanations and debugging, on demand.",
        icon: Sparkles,
        angle: 255,
    },
    {
        id: "contribute",
        label: "Contribute",
        description: "Suggest topics and questions, and help shape the platform.",
        icon: GitPullRequest,
        angle: 306,
    },
];
