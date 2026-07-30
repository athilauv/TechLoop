export function toParagraphs(text: string | null | undefined): string[] {
    if (!text) return [];

    return text
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .filter(Boolean);
}

export function formatDate(value: string | null | undefined): string | null {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return date.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}
