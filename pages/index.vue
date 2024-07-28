<template>
    <div class="flex flex-col gap-6">
        <Details/>
        <UCard>
            <UTable :sort="sort" :columns="columns" :rows="rows" :empty-state="{ icon: 'i-heroicons-circle-stack', label: 'No trades' }">
                <template #open-data="{ row }">
                    <span>{{ `${row.open.toDate().toDateString()} ${row.open.toDate().toLocaleTimeString([], { timeStyle: "short" })}` }}</span>
                </template>
                <template #symbol-data="{ row }">
                    <span class="font-medium">{{ row.symbol }}</span>
                </template>
                <template #strategy-data="{ row }">
                    <UBadge v-if="row.strategy" :label="row.strategy" variant="subtle"/>
                </template>
                <template #rr-data="{ row }">
                    <span v-if="row.rr !== undefined && row.rr !== null">{{ row.rr.toFixed(2) }}</span>
                    <span v-else/>
                </template>
                <template #risk-data="{ row }">
                    <span v-if="row.risk !== undefined && row.risk !== null">{{ `${row.risk.toFixed(2)} €` }}</span>
                    <span v-else/>
                </template>
                <template #pnl-data="{ row }">
                    <span v-if="row.pnl !== undefined && row.pnl !== null" :class="['font-medium', { 'text-green-500': row.pnl > 0 }, { 'text-red-500': row.pnl < 0 }]">
                        {{ `${row.pnl >= 0 ? "+" : ""}${row.pnl.toFixed(2)} €` }}
                    </span>
                    <span v-else/>
                </template>
                <template #status-data="{ row }">
                    <UBadge v-if="row.pnl > 0" label="Win" variant="subtle" color="green"/>
                    <UBadge v-if="row.pnl < 0" label="Lose" variant="subtle" color="red"/>
                    <UBadge v-if="row.pnl === 0" label="Breakeven" variant="subtle" color="blue"/>
                </template>
                <template #actions-data="{ row }">
                    <UDropdown :items="tradeActions(row)">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" square/>
                    </UDropdown>
                </template>
            </UTable>
            <div class="flex justify-center sm:justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                <UPagination v-model="page" :page-count="tradesPerPage" :total="trades.length ?? 0" :max="3"/>
            </div>
        </UCard>
    </div>
    <USlideover v-model="isSlideoverOpen" :ui="{ width: 'max-w-xl' }">
        <UCard class="h-full overflow-y-auto" :ui="{ rounded: 'rounded-none' }">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-eye"/>
                        <h1 class="text-lg font-medium">Preview Trade</h1>
                    </div>
                    <UButton @click="isSlideoverOpen = false" icon="i-heroicons-x-mark" variant="ghost" color="gray"/>
                </div>
            </template>
            <div v-if="previewedTrade" class="flex flex-col gap-4">
                <ULink v-if="previewedTrade.imageUrl" :to="previewedTrade.imageUrl" target="_blank" class="cursor-pointer hover:opacity-50 transition">
                    <NuxtImg :src="previewedTrade.imageUrl"/>
                </ULink>
                <div v-if="previewedTrade.imageUrl" class="flex flex-col">
                    <UButton 
                        @click="() => {
                            if (previewedTrade && previewedTrade.imageUrl) {
                                clipboard.copy(previewedTrade.imageUrl);
                                toast.add({ title: 'Copied to clipboard', icon: 'i-heroicons-clipboard-document' });
                            }
                        }" 
                        icon="i-heroicons-clipboard-document" 
                        :label="previewedTrade.imageUrl" 
                        variant="link" 
                        :padded="false" 
                        color="gray" 
                        class="text-xs mb-2 active:opacity-50"
                    />
                    <span class="text-sm">{{ `${previewedTrade.open.toDate().toDateString()} ${previewedTrade.open.toDate().toLocaleTimeString([], { timeStyle: "short" })}` }}</span>
                    <div class="flex items-center gap-2">
                        <h2 class="font-medium text-xl">{{ previewedTrade.symbol }}</h2>
                        <div v-if="previewedTrade.pnl">
                            <UBadge v-if="previewedTrade.pnl > 0" label="Win" variant="subtle" color="green"/>
                            <UBadge v-if="previewedTrade.pnl < 0" label="Lose" variant="subtle" color="red"/>
                            <UBadge v-if="previewedTrade.pnl === 0" label="Breakeven" variant="subtle" color="blue"/>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <span v-if="previewedTrade.rr">Risk Reward: <span class="font-medium">{{ previewedTrade.rr.toFixed(2) }}</span></span>
                    <span v-if="previewedTrade.risk">Original Risk: <span class="font-medium text-red-500">{{ `${previewedTrade.risk.toFixed(2)} €` }}</span></span>
                    <span v-if="previewedTrade.pnl">
                        Net P&L: <span :class="['font-medium', 'text-green-500', { 'text-green-500': previewedTrade.pnl > 0 }, { 'text-red-500': previewedTrade.pnl < 0 }]">
                            {{ `${previewedTrade.pnl >= 0 ? "+" : ""}${previewedTrade.pnl.toFixed(2)} €` }}
                        </span>
                    </span>
                </div>
                <div v-if="previewedTrade.note">
                    <h3 class="mb-2 font-medium text-lg">Note</h3>
                    <pre class="font-sans">{{ previewedTrade.note }}</pre>
                </div>
            </div>
            <template v-if="previewedTrade && (previewedTrade.strategy || previewedTrade.tags.length > 0)" #footer>
                <div v-if="previewedTrade.strategy" class="mb-4">
                    <h3 class="mb-2 font-medium text-lg">Strategy</h3>
                    <UBadge :label="previewedTrade.strategy" variant="subtle"/>
                </div>
                <div v-if="previewedTrade.tags.length > 0">
                    <h3 class="mb-2 font-medium text-lg">Tags</h3>
                    <div class="flex flex-wrap gap-2">
                        <UBadge v-for="tag in previewedTrade.tags" :label="tag.label" :color="tag.color" variant="subtle"/>
                    </div>
                </div>
            </template>
        </UCard>
    </USlideover>
</template>

<script setup lang="ts">
    import { doc, addDoc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
    import { isWithinInterval, isSameDay } from "date-fns";

    definePageMeta({ layout: "app" });

    const clipboard = useCopyToClipboard();
    const toast = useToast();
    const firestore = useFirestore();
    const trades = useTrades();
    const editedTrade = useEditedTrade();
    const selectedDateRange = useSelectedDateRange();

    const tradesPerPage: number = 10;
    const page = ref<number>(1);
    
    const previewedTrade = ref<Trade | null>(null);
    const isSlideoverOpen = ref<boolean>(false);
    const chart = ref();

    const sort = ref<{ column: keyof Trade; direction: "asc" | "desc" }>({
        column: "open",
        direction: "desc",
    });

    const columns = [
        { key: "open", label: "Open Date", sortable: true },
        { key: "symbol", label: "Symbol" },
        { key: "strategy", label: "Strategy" },
        { key: "rr", label: "Risk Reward", sortable: true },
        { key: "risk", label: "Original Risk", sortable: true },
        { key: "pnl", label: "Net P&L", sortable: true },
        { key: "status", label: "Status" },
        { key: "actions" },
    ];

    const tradeActions = (trade: Trade) => {
        return [
            [
                {
                    label: "Preview",
                    icon: "i-heroicons-eye",
                    click: () => {
                        isSlideoverOpen.value = true;
                        previewedTrade.value = trade;
                    },
                },
            ],
            [
                {
                    label: "Edit",
                    icon: "i-heroicons-pencil-square",
                    click: () => editedTrade.value = trade,
                },
                {
                    label: "Duplicate",
                    icon: "i-heroicons-document-duplicate",
                    click: () => {
                        addDoc(tradesRef.value, trade).then(ref => {
                            updateDoc(ref, { id: ref.id });
                        });
                    },
                },
            ],
            [
                {
                    label: "Delete",
                    icon: "i-heroicons-trash",
                    click: () => {
                        getDoc(doc(firestore, `${tradesRef.value.path}/${trade.id}`)).then(snapshot => {
                            const tmp = snapshot.data();
                            deleteDoc(snapshot.ref).then(() => {
                                toast.add({
                                    title: "Trade has been deleted",
                                    icon: "i-heroicons-trash",
                                    actions: [{
                                        label: "Undo",
                                        click: () => addDoc(tradesRef.value, tmp).then(ref => {
                                            updateDoc(ref, { id: ref.id });
                                        }),
                                    }],
                                });
                            });
                        });
                    },
                },
            ],
        ]
    };

    const rows = computed<Trade[]>(() => {
        if (trades.value) {
            const { column, direction } = sort.value;
            const fileteredTrades: Trade[] = selectedDateRange.value
                ? (trades.value as Trade[]).filter(trade => {
                    const tradeOpen = trade.open.toDate()
                    if (isWithinInterval(tradeOpen, selectedDateRange.value!) 
                        || isSameDay(tradeOpen, selectedDateRange.value!.start)
                        || isSameDay(tradeOpen, selectedDateRange.value!.end)) {
                            return true;
                    } else return false;
                })
                : trades.value as Trade[];
            return useOrderBy(fileteredTrades, column, direction).slice((page.value - 1) * tradesPerPage, (page.value) * tradesPerPage);
        } else return [];
    });

    onMounted(() => {
        if (chart.value) {
            const canvas = chart.value.getDom().querySelector("canvas") as HTMLCanvasElement;
            if (canvas) canvas.classList.add("rounded-b-lg");
            
            window.addEventListener("resize", handleResize);
            onBeforeUnmount(() => window.removeEventListener("resize", handleResize));

            function handleResize() {
                chart.value.resize();
            }
        }
    });
</script>