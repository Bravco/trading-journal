export const useTags = () => useState<Tag[]>("tags", () => [
    {
        label: "Demand Zone",
        color: "red",
    },
    {
        label: "Fair Value Gap",
        color: "green",
    },
    {
        label: "Inverse Fair Value Gap",
        color: "yellow",
    },
    {
        label: "Liquidity Sweep",
        color: "orange",
    },
]);

export const useTrades = () => useState<Trade[]>("trades", () => [
    {
        open: new Date("2024-07-05T19:58:00"),
        symbol: "YM",
        strategy: "Liquidity Sweep + IFVG",
        risk: 8.7,
        pnl: 5.13,
        rr: 1.17,
        imageUrl: "https://www.tradingview.com/x/IqNKyxNQ/",
        tags: [
            { label: "Liquidity Sweep", color: "orange" },
            { label: "Inverse Fair Value Gap", color: "yellow" },
        ],
    },
    {
        open: new Date("2024-07-05T15:35:00"),
        symbol: "NQ",
        strategy: "Liquidity Sweep + FVG",
        risk: 10,
        pnl: 21,
        rr: 2.1,
        imageUrl: "https://www.tradingview.com/x/IqNKyxNQ/",
        tags: [
            { label: "Liquidity Sweep", color: "orange" },
            { label: "Fair Value Gap", color: "green" },
        ],
    },
    {
        open: new Date("2024-07-04T14:24:00"),
        symbol: "GBPUSD",
        strategy: "Demand + FVG",
        risk: 10.49,
        pnl: -7.64,
        rr: 3.08,
        imageUrl: "https://www.tradingview.com/x/IqNKyxNQ/",
        tags: [
            { label: "Demand Zone", color: "red" },
            { label: "Fair Value Gap", color: "green" },
        ],
    },
    {
        open: new Date("2024-07-03T15:11:00"),
        symbol: "EURUSD",
        strategy: "Demand + IFVG",
        risk: 9.87,
        pnl: -9.87,
        rr: 1.93,
        imageUrl: "https://www.tradingview.com/x/IqNKyxNQ/",
        tags: [
            { label: "Demand Zone", color: "red" },
            { label: "Inverse Fair Value Gap", color: "yellow" },
        ],
    },
    {
        open: new Date("2024-07-02T16:02:00"),
        symbol: "NQ",
        strategy: "Liquidity Sweep + FVG",
        risk: 10.1,
        pnl: 24.12,
        rr: 3.29,
        imageUrl: "https://www.tradingview.com/x/IqNKyxNQ/",
        tags: [
            { label: "Liquidity Sweep", color: "orange" },
            { label: "Fair Value Gap", color: "green" },
        ],
    },
    {
        open: new Date("2024-07-02T19:41:00"),
        symbol: "NQ",
        strategy: "Liquidity Sweep + FVG",
        risk: 9.97,
        pnl: 17.64,
        rr: 2.03,
        imageUrl: "https://www.tradingview.com/x/IqNKyxNQ/",
        tags: [
            { label: "Liquidity Sweep", color: "orange" },
            { label: "Fair Value Gap", color: "green" },
        ],
    },
    {
        open: new Date("2024-07-01T09:55:00"),
        symbol: "NQ",
        strategy: "Liquidity Sweep + IFVG",
        risk: 10.54,
        pnl: 20.94,
        rr: 2.53,
        imageUrl: "https://www.tradingview.com/x/IqNKyxNQ/",
        tags: [
            { label: "Liquidity Sweep", color: "orange" },
            { label: "Inverse Fair Value Gap", color: "yellow" },
        ],
    },
    {
        open: new Date("2024-06-28T20:45:00"),
        symbol: "YM",
        strategy: "Liquidity Sweep + FVG",
        risk: 9.15,
        pnl: 0,
        rr: 1.94,
        imageUrl: "https://www.tradingview.com/x/IqNKyxNQ/",
        tags: [
            { label: "Liquidity Sweep", color: "orange" },
            { label: "Fair Value Gap", color: "green" },
        ],
    },
]);