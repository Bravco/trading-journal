import type { Interval } from "date-fns";

export const useSelectedAccountId = () => useState<string | null>("selectedAccountId", () => null);
export const useSelectedAccount = () => useState<any>("selectedAccount", () => null);
export const useTrades = () => useState<Trade[]>("trades", () => []);

export const useEditedTrade = () => useState<Trade | null>("editedTrade", () => null);
export const useIsAddAccountModalOpen = () => useState<boolean>("isAddAccountModalOpen", () => false);
export const useSelectedDateRange = () => useState<Interval | null>("selectedDateRange", () => null);