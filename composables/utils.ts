import { CollectionReference, type DocumentReference, collection, doc } from "firebase/firestore";
import { isWithinInterval, isSameDay } from "date-fns";

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

export const selectedAccountRef = computed<DocumentReference>(() => {
    const user = useCurrentUser();
    const firestore = useFirestore();
    const selectedAccountId = useSelectedAccountId();
    return doc(firestore, `users/${user.value!.uid}/accounts/${selectedAccountId.value}`);
});

export const tradesRef = computed<CollectionReference>(() => {
    const firestore = useFirestore();
    return collection(firestore, selectedAccountRef.value.path + "/trades");
});

export const customFieldsRef = computed<CollectionReference>(() => {
    const user = useCurrentUser();
    const firestore = useFirestore();
    return collection(firestore, `users/${user.value!.uid}/customFields`);
});

export const filteredTrades = computed<Trade[]>(() => {
    const trades = useTrades();
    const selectedDateRange = useSelectedDateRange();

    if (selectedDateRange.value) {
        return trades.value.filter(trade => {
            const tradeOpen = trade.open.toDate();
            if (isWithinInterval(tradeOpen, selectedDateRange.value!) 
                || isSameDay(tradeOpen, selectedDateRange.value!.start)
                || isSameDay(tradeOpen, selectedDateRange.value!.end)) {
                    return true;
            } else return false;
        })
    } else return trades.value;
});

export const totalPnl = computed<number>(() => 
    filteredTrades.value.reduce((acc, trade) => acc + (trade.pnl ?? 0), 0));

export const RMultiple = computed<number>(() => 
    filteredTrades.value.reduce((acc, trade) => acc + (trade.pnl && trade.risk ? trade.pnl/trade.risk : 0), 0));