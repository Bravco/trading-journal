type Account = {
    title: string,
    trades: Trade[],
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

type Tag = {
    label: string,
    color: string,
};