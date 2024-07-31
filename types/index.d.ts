import type { Timestamp } from "firebase/firestore";

declare global {
    type Trade = {
        id: string,
        open: Timestamp,
        symbol: string,
        risk?: number | null,
        rr?: number | null,
        pnl?: number | null,
        imageUrl?: string | null,
        strategy?: string | null,
        note?: string | null,
        tags: Tag[],
    }

    type Tag = {
        label: string,
        color: string,
    }
}