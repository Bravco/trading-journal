type Trade = {
    open: Date,
    symbol: string,
    strategy: string,
    risk: number,
    rr: number,
    pnl: number,
    imageUrl: string,
    tags: Tag[],
};

type Tag = {
    label: string,
    color: string,
};