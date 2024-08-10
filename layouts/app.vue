<template>
    <div class="fixed inset-0 flex overflow-auto">
        <aside class="min-w-64 sticky top-0 z-10 hidden lg:block"><Sidebar/></aside>
        <div class="w-full lg:w-[calc(100%-16rem)] relative">
            <header class="sticky top-0 z-10">
                <div class="flex justify-between bg-white dark:bg-gray-900 items-center p-4 border-b border-gray-200 dark:border-gray-800">
                    <div class="flex items-stretch gap-2">
                        <UButton class="lg:hidden" @click="isSidebarSlideoverOpen = true" icon="i-heroicons-bars-3" variant="ghost" color="gray" square/>
                        <h1 class="text-xl font-bold">Trading <span class="text-primary">Journal</span></h1>
                    </div>
                    <div class="flex items-center gap-2">
                        <UButton 
                            v-if="selectedDateRange" 
                            @click="clearSelectedRange"
                            icon="i-heroicons-x-mark" 
                            variant="ghost" 
                            color="gray"
                            :ui="{ rounded: 'rounded-full' }"
                        />
                        <UPopover :popper="{ placement: 'bottom-start' }">
                            <UButton icon="i-heroicons-calendar-days" variant="outline" color="gray">
                                {{
                                    selectedDateRange
                                    ? (isSameDay(selectedDateRange.start, selectedDateRange.end)
                                        ? format(selectedDateRange.start, "d MMM, yyy")
                                        : `${format(selectedDateRange.start, "d MMM, yyy")} - ${format(selectedDateRange.end, "d MMM, yyy")}`)
                                    : "All"
                                }}
                            </UButton>
                            <template #panel="{ close }">
                                <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
                                    <div class="hidden sm:flex flex-col py-4">
                                        <UButton
                                            v-for="(range, index) in dateRanges"
                                            :key="index"
                                            :label="range.label"
                                            color="gray"
                                            variant="ghost"
                                            class="rounded-none px-6"
                                            :class="[isDateRangeSelected(range.duration) ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50']"
                                            truncate
                                            @click="selectDateRange(range.duration)"
                                        />
                                    </div>
                                    <DatePicker v-model="selectedDateRange" @close="close"/>
                                </div>
                            </template>
                        </UPopover>
                        <UButton 
                            @click="openSlideover" 
                            label="New Trade" 
                            icon="i-heroicons-document-plus" 
                            :disabled="selectedAccount ? false : true"
                        />
                    </div>
                </div>
            </header>
            <div class="h-full flex flex-col">
                <main class="p-4">
                    <slot v-if="selectedAccount"/>
                    <div v-else class="grid place-items-center gap-2">
                        <p>You have no trading account or none selected</p>
                        <UButton @click="isAddAccountModalOpen = true" label="Add a trading account" icon="i-heroicons-user-plus"/>
                    </div>
                </main>
                <footer class="mt-auto pb-4">
                    <div class="w-full mt-4 text-center text-sm">Copyright &copy; 2024</div>
                </footer>
            </div>
        </div>
    </div>
    <USlideover v-model="isSidebarSlideoverOpen" side="left">
        <Sidebar>
            <template #closeButton>
                <UButton class="lg:hidden" @click="isSidebarSlideoverOpen = false" icon="i-heroicons-bars-3" variant="ghost" color="gray" square/>
            </template>
        </Sidebar>
    </USlideover>
    <USlideover v-model="isTradeSlideoverOpen" :ui="{ width: 'max-w-xl' }">
        <UCard class="h-full overflow-y-auto" :ui="{ rounded: 'rounded-none' }">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-document-plus"/>
                        <h1 class="text-lg font-medium">{{ editedTrade === null ? "New Trade" : "Edit Trade" }}</h1>
                    </div>
                    <UButton @click="isTradeSlideoverOpen = false" icon="i-heroicons-x-mark" variant="ghost" color="gray"/>
                </div>
            </template>
            <UForm @submit="onSubmit" @keydown.enter="$event.preventDefault()" :schema="schema" :state="state" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <UFormGroup label="Open Date" name="open" required>
                        <UInput v-model="state.open" type="datetime-local"/>
                    </UFormGroup>
                    <UFormGroup label="Symbol" name="symbol" required>
                        <UInput v-model="state.symbol" type="text"/>
                    </UFormGroup>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <UFormGroup label="Risk Reward" name="rr">
                        <UInput v-model="state.rr" type="decimal" min="0" placeholder="0.00"/>
                    </UFormGroup>
                    <UFormGroup label="Original Risk" name="risk">
                        <UInput v-model="state.risk" type="decimal" min="0" placeholder="0.00">
                            <template #trailing>
                                <span class="text-gray-500 dark:text-gray-400 text-xs">EUR</span>
                            </template> 
                        </UInput>
                    </UFormGroup>
                    <UFormGroup label="Net P&L" name="pnl">
                        <UInput v-model="state.pnl" type="decimal" placeholder="0.00">
                            <template #trailing>
                                <span class="text-gray-500 dark:text-gray-400 text-xs">EUR</span>
                            </template>
                        </UInput>
                    </UFormGroup>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <UFormGroup label="Image Url" name="imageUrl">
                        <UInput v-model="state.imageUrl" type="text" placeholder="https://..."/>
                    </UFormGroup>
                    <UFormGroup label="Strategy" name="strategy">
                        <UInput v-model="state.strategy" type="text">
                            <template #trailing>
                                <UDropdown 
                                    v-if="strategyOptions[0].length !== 0" 
                                    :items="strategyOptions" 
                                    class="pointer-events-auto"
                                >
                                    <UIcon name="i-heroicons-chevron-down "/>
                                </UDropdown>
                            </template>
                        </UInput>
                    </UFormGroup>
                </div>
                <UFormGroup label="Note" name="note">
                    <UTextarea
                        @keydown.enter="() => state.note = state.note + '\n'" 
                        v-model="state.note" 
                        maxlength="500"
                        :maxrows="5"
                        autoresize 
                    />
                    <span class="text-xs">{{ state.note ? state.note.length : 0 }} / 500</span>
                </UFormGroup>
                <UFormGroup label="Tags" name="tags">
                    <div class="flex items-center justify-between gap-2">
                        <UInput @keydown.enter="pushNewTag" v-model="state.tagLabel" type="text" class="w-full">
                            <template #trailing>
                                <UDropdown 
                                    v-if="tagOptions[0].length !== 0" 
                                    :items="tagOptions" 
                                    class="pointer-events-auto" 
                                    :ui="{ width: 'w-fit' }"
                                >
                                    <UIcon name="i-heroicons-chevron-down "/>
                                    <template v-for="color in colors" #[color]="{ item: tag }">
                                        <UBadge :label="tag.label" :color="color" variant="subtle"/>
                                    </template>
                                </UDropdown>
                            </template>
                        </UInput>
                        <UDropdown :items="colorOptions" :ui="{ width: 'w-fit', padding: 'grid grid-cols-5' }">
                            <UButton icon="i-heroicons-swatch" variant="ghost" :color="state.tagColor ?? 'gray'"/>
                            <template v-for="color in colors" #[color]="{}">
                                <UTooltip :text="color" class="capitalize">
                                    <span :class="['inline-block', 'w-3', 'h-3', 'rounded-full', `bg-${color}-500`]"/>
                                </UTooltip>
                            </template>
                        </UDropdown>
                        <UButton @click="pushNewTag" icon="i-heroicons-plus"/>
                    </div>
                    <div class="min-h-11 flex flex-wrap gap-2 mt-2 p-2.5 rounded-md ring-1 ring-inset ring-gray-300 dark:ring-gray-700">
                        <UBadge 
                            v-for="tag in state.tags" 
                            @click="state.tags = state.tags.filter((t: Tag) => t !== tag)" 
                            :color="tag.color" 
                            variant="subtle" 
                            class="h-fit flex items-center justify-center gap-1 cursor-pointer"
                        >
                            <span>{{ tag.label }}</span>
                            <UIcon class="mt-px" name="i-heroicons-x-mark"/>
                        </UBadge>
                    </div>
                </UFormGroup>
                <UDivider/>
                <UButton 
                    type="submit" 
                    :label="editedTrade === null ? 'Create' : 'Save'" 
                    :icon="editedTrade === null ? 'i-heroicons-plus' : 'i-heroicons-check'"
                />
            </UForm>
        </UCard>
    </USlideover>
</template>

<script lang="ts" setup>
    import { Timestamp } from "firebase/firestore";
    import { doc, getDoc, addDoc, updateDoc } from "firebase/firestore";
    import { object, string, number, date, array } from "yup";
    import { sub, format, isSameDay } from "date-fns";
    import type { Duration } from "date-fns";

    const firestore = useFirestore();
    const selectedAccount = useSelectedAccount();
    const trades = useTrades();
    const editedTrade = useEditedTrade();
    const isAddAccountModalOpen = useIsAddAccountModalOpen();
    const selectedDateRange = useSelectedDateRange();
    
    const schema = object({
        open: date().required("Open Date is required"),
        symbol: string().required("Symbol is required"),
        strategy: string().nullable(),
        risk: number().transform(value => Number.isNaN(value) ? null : value).nullable().positive("Original Risk must be a positive number"),
        rr: number().transform(value => Number.isNaN(value) ? null : value).nullable().positive("Risk Reward must be a positive number"),
        pnl: number().transform(value => Number.isNaN(value) ? null : value).nullable(),
        imageUrl: string().nullable().url("Image Url must be a valid URL"),
        note: string().nullable(),
        tagLabel: string(),
        tagColor: string(),
        tags: array(),
    });

    const initialState: any = {
        open: undefined,
        symbol: undefined,
        risk: undefined,
        rr: undefined,
        pnl: undefined,
        imageUrl: undefined,
        strategy: undefined,
        note: undefined,
        tagLabel: undefined,
        tagColor: undefined,
        tags: [],
    };
    
    const state = reactive<any>({ ...initialState });

    const dateRanges = [
        { label: "Today", duration: { days: 0 } },
        { label: "Last 7 days", duration: { days: 7 } },
        { label: "Last 14 days", duration: { days: 14 } },
        { label: "Last 30 days", duration: { days: 30 } },
        { label: "Last 3 months", duration: { months: 3 } },
        { label: "Last 6 months", duration: { months: 6 } },
        { label: "Last year", duration: { years: 1 } },
    ];

    function isDateRangeSelected(duration: Duration) {
        if (selectedDateRange.value) {
            return isSameDay(selectedDateRange.value.start, sub(new Date(), duration)) && isSameDay(selectedDateRange.value.end, new Date());
        } else return false;
    }

    function selectDateRange(duration: Duration) {
        selectedDateRange.value = { start: sub(new Date(), duration), end: new Date() };
    }

    function clearSelectedRange() {
        selectedDateRange.value = null;
    }

    const strategyOptions = computed<any>(() => {
        const strategies = Array.from(new Set(
            trades.value.flatMap(trade => trade.strategy).filter((strategy): strategy is string => strategy !== null)
        )).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

        return [strategies.map(strategy => ({
            label: strategy,
            click: () => state.strategy = strategy,
        }))];
    });

    const tagOptions = computed<any[]>(() => {
        const tags = Array.from(new Set(trades.value.flatMap(trade => trade.tags.map((tag: Tag) => JSON.stringify(tag)))))
            .map(tagStr => JSON.parse(tagStr))
            .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));

        return [tags.map(tag => ({
            label: tag.label,
            slot: tag.color,
            click: () => state.tags.push(tag),
        }))];
    });

    const colorOptions: any[] = [
        colors.map(color => ({
            slot: color,
            click: () => state.tagColor = color,
        })),
    ];

    const isSidebarSlideoverOpen = ref<boolean>(false);
    const isTradeSlideoverOpen = ref<boolean>(false);

    function openSlideover() {
        function formatOpenDate(date: Date) {
            const offset = date.getTimezoneOffset() * 60000;
            const adjustedDate = new Date(date.getTime() - offset);
            return adjustedDate.toISOString().substring(0, 16);
        }

        if (editedTrade.value) {
            Object.assign(state, {
                ...initialState,
                ...editedTrade.value,
                open: formatOpenDate(editedTrade.value.open.toDate()),
            });
        } else {
            Object.assign(state, {
                ...initialState,
                open: formatOpenDate(new Date()),
                tags: [],
            });
        }

        isTradeSlideoverOpen.value = true;
    }

    function pushNewTag() {
        if (typeof state.tagLabel === "string" && state.tagLabel.trim().length > 0) {
            state.tags.push({
                label: state.tagLabel,
                color: state.tagColor ?? "gray",
            });
            state.tagLabel = undefined;
            state.tagColor = undefined;
        }
    }

    async function onSubmit() {
        getDoc(selectedAccountRef.value).then(() => {
            const newTrade: Omit<Trade, "id"> = {
                open: Timestamp.fromDate(new Date(state.open)),
                symbol: state.symbol,
                risk: state.risk ? parseFloat(state.risk) : null,
                rr: state.rr ? parseFloat(state.rr) : null,
                pnl: state.pnl ? parseFloat(state.pnl) : null,
                imageUrl: state.imageUrl ?? null,
                strategy: state.strategy ?? null,
                note: state.note ?? null,
                tags: state.tags ?? [],
            };

            if (editedTrade.value === null) {
                addDoc(tradesRef.value, newTrade).then(tradeRef => {
                    updateDoc(tradeRef, { id: tradeRef.id });
                });
                isTradeSlideoverOpen.value = false;
            } else {
                updateDoc(doc(firestore, `${tradesRef.value.path}/${editedTrade.value.id}`), newTrade)
                    .then(() => isTradeSlideoverOpen.value = false)
                    .catch(() => isTradeSlideoverOpen.value = false);
            }
        });
    }

    watch(isTradeSlideoverOpen, () => {
        if (isTradeSlideoverOpen.value === false) {
            editedTrade.value = null;
        } 
    });

    watch(editedTrade, () => {
        if (editedTrade.value !== null) {
            openSlideover();
        }
    });
</script>