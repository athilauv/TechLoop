const API_URL = "http://localhost:5264/api/analytics";

export async function getAnalytics() {
    const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result?.message ||
            result?.Message ||
            "Failed to load analytics"
        );
    }

    return result;
}