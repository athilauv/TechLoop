export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();

    const diffInSeconds = Math.floor(
        (now.getTime() - date.getTime()) / 1000
    );

    if (diffInSeconds < 0) {
        return "Just now";
    }

    if (diffInSeconds < 60) {
        return "Just now";
    }

    const diffInMinutes = Math.floor(
        diffInSeconds / 60
    );

    if (diffInMinutes < 60) {
        return `${diffInMinutes}m`;
    }

    const diffInHours = Math.floor(
        diffInMinutes / 60
    );

    if (diffInHours < 24) {
        return `${diffInHours}h`;
    }

    const diffInDays = Math.floor(
        diffInHours / 24
    );

    if (diffInDays <= 30) {
        return `${diffInDays}d`;
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}