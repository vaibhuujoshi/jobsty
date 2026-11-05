export function cleanDescription(description: string | null): string {
    if (!description) return "";

    const document = new DOMParser().parseFromString(
        description,
        "text/html"
    );

    // Preserve basic paragraph and line breaks before extracting text.
    document.querySelectorAll("br").forEach((element) => {
        element.replaceWith("\n");
    });

    document.querySelectorAll("p, div, li, h1, h2, h3, h4").forEach(
        (element) => {
            element.append("\n");
        }
    );

    return (document.body.textContent || "")
        .replace(/\u00a0/g, " ")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[ \t]{2,}/g, " ")
        .trim();
}