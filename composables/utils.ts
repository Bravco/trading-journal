export const colors: string[] = [
    "gray",
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
    "rose",
];

export function isTag(obj: any): obj is Tag {
    return obj &&
        typeof obj === "object" &&
        typeof obj.label === "string" &&
        typeof obj.color === "string";
}

export function isTrade(obj: any): obj is Trade {
    return obj &&
        typeof obj === "object" &&
        obj.open instanceof Date &&
        typeof obj.symbol === 'string' &&
        typeof obj.strategy === 'string' &&
        typeof obj.risk === 'number' &&
        typeof obj.rr === 'number' &&
        typeof obj.pnl === 'number' &&
        typeof obj.imageUrl === 'string' &&
        Array.isArray(obj.tags) &&
        obj.tags.every(isTag);
}