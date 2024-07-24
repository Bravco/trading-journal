export const useEditedTrade = () => useState<Trade | null>("editedTrade", () => null);
export const useSelectedAccountId = () => useState<string | null>("selectedAccountId", () => null);
export const useIsAddAccountModalOpen = () =>  useState<boolean>("isAddAccountModalOpen", () => false);