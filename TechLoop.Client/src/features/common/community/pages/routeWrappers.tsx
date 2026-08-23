import CommunityFeedPage from "./CommunityFeedPage";
import CommunityPostPage from "./CommunityPostPage";
import SavedPostsPage from "./SavedPostsPage";

export function LearnerCommunityPage() {
    return (
        <CommunityFeedPage
            role="learner"
            routeBase="/learner/community"
        />
    );
}

export function LearnerCommunityPostPage() {
    return (
        <CommunityPostPage
            role="learner"
            routeBase="/learner/community"
        />
    );
}

export function LearnerSavedPostsPage() {
    return (
        <SavedPostsPage
            role="learner"
            routeBase="/learner/community"
        />
    );
}

export function MentorCommunityPage() {
    return (
        <CommunityFeedPage
            role="mentor"
            routeBase="/mentor/community"
        />
    );
}

export function MentorCommunityPostPage() {
    return (
        <CommunityPostPage
            role="mentor"
            routeBase="/mentor/community"
        />
    );
}

export function MentorSavedPostsPage() {
    return (
        <SavedPostsPage
            role="mentor"
            routeBase="/mentor/community"
        />
    );
}