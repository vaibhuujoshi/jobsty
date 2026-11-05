
export function formatJobDescription(description: string): string {
    if (!description) return "";

    const parser = new DOMParser();
    const document = parser.parseFromString(description, "text/html");

    const blockTags = new Set([
        "P",
        "DIV",
        "SECTION",
        "ARTICLE",
        "H1",
        "H2",
        "H3",
        "H4",
        "BR",
    ]);

    function processNode(node: Node): string {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent ?? "";
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
            return "";
        }

        const element = node as HTMLElement;
        const tag = element.tagName;

        if (tag === "BR") return "\n";

        if (tag === "LI") {
            const content = Array.from(element.childNodes)
                .map(processNode)
                .join("")
                .trim();

            return content ? `• ${content}\n` : "";
        }

        const content = Array.from(element.childNodes)
            .map(processNode)
            .join("");

        if (tag === "UL" || tag === "OL") {
            return `\n${content}\n`;
        }

        if (blockTags.has(tag)) {
            return `\n${content}\n`;
        }

        return content;
    }

    return Array.from(document.body.childNodes)
        .map(processNode)
        .join("")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n[ \t]+/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[ \t]{2,}/g, " ")
        .trim();
}