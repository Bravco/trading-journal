type Tag = {
    label: string,
    color: string,
};

type Trade = {
    open: Date,
    symbol: string,
    risk?: number | null,
    rr?: number | null,
    pnl?: number | null,
    imageUrl?: string | null,
    strategy?: string | null,
    note?: string | null,
    tags: Tag[],
};