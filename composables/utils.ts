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

export const tags = computed<Tag[]>(() => {
    const accounts = useAccounts();
    const selectedAccountId = useSelectedAccountId();

    return Array.from(new Set(accounts.value[selectedAccountId.value].trades.flatMap(trade => trade.tags.map(tag => JSON.stringify(tag)))))
        .map(tagStr => JSON.parse(tagStr))
        .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));
});

export const strategies = computed<string[]>(() => {
    const accounts = useAccounts();
    const selectedAccountId = useSelectedAccountId();

    return Array.from(new Set(
        accounts.value[selectedAccountId.value].trades.flatMap(trade => trade.strategy).filter((strategy): strategy is string => strategy !== null)
    )).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
});

export const cumulativePnl = computed<number[]>(() => {
    const accounts = useAccounts();
    const selectedAccountId = useSelectedAccountId();
    const sortedTrades = accounts.value[selectedAccountId.value].trades.sort((a: Trade, b: Trade) => a.open.getTime() - b.open.getTime());
    const pnlValues = sortedTrades.map(trade => trade.pnl);

    return pnlValues.reduce((acc: number[], pnl) => {
        if (pnl) {
            if (acc.length === 0) {
                acc.push(pnl);
            } else {
                acc.push(acc[acc.length - 1] + pnl);
            }
        }
        return acc;
    }, []);
});

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