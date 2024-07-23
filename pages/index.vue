<template>
    <div v-if="accounts[selectedAccountId]" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
            <UCard class="relative">
                <template #header>
                    <div class="h-4 md:h-6 flex items-center gap-2">
                        <span class="text-sm">Net P&L</span>
                        <UTooltip text="Total of all profits and losses">
                            <UIcon name="i-heroicons-information-circle"/>
                        </UTooltip>
                    </div>
                </template>
                <div class="h-16 md:h-24 flex justify-between items-center gap-4 sm:gap-8">
                    <span :class="['z-10', 'text-3xl', 'font-bold', { 'text-green-500': totalPnl > 0 }, { 'text-red-500': totalPnl < 0 }]">
                        {{ `${totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)} €` }}
                    </span>
                </div>
                <VChart ref="chart" class="w-full h-2/6 absolute left-0 bottom-0" :option="chartOption"/>
            </UCard>
            <UCard>
                <template #header>
                    <div class="h-4 md:h-6 flex justify-between items-center">
                        <div class="flex items-center gap-2">
                            <span class="text-sm">Win Rate</span>
                            <UTooltip text="Percentage of winning trades">
                                <UIcon name="i-heroicons-information-circle"/>
                            </UTooltip>
                        </div>
                        <UTooltip text="Total number of trades">
                            <UBadge :label="accounts[selectedAccountId]?.trades.length ?? 0" variant="solid" color="gray"/>
                        </UTooltip>
                    </div>
                </template>
                <div class="h-16 md:h-24 flex justify-between items-center gap-4 sm:gap-8">
                    <span class="text-2xl font-bold">{{ `${Number.isNaN(winRate) ? 0 : winRate.toFixed(2)}%` }}</span>
                    <div class="flex gap-4">
                        <RadialProgress :progress-primary="winRate" :progress-secondary="breakevenRate"/>
                        <div class="flex flex-col justify-center items-center gap-2">
                            <UTooltip text="Total number of win trades">
                                <UBadge :label="winTrades.length" variant="subtle" color="green"/>
                            </UTooltip>
                            <div class="flex flex-row md:flex-col justify-center items-center gap-2">
                                <UTooltip text="Total number of breakeven trades">
                                    <UBadge :label="breakevenTrades.length" variant="subtle" color="blue"/>
                                </UTooltip>
                                <UTooltip text="Total number of lose trades">
                                    <UBadge :label="loseTrades.length" variant="subtle" color="red"/>
                                </UTooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </UCard>
            <UCard>
                <template #header>
                    <div class="h-4 md:h-6 flex items-center gap-2">
                        <span class="text-sm">Profit Factor</span>
                        <UTooltip text="Ratio of the total gross profit to the total gross loss">
                            <UIcon name="i-heroicons-information-circle"/>
                        </UTooltip>
                    </div>
                </template>
                <div class="h-16 md:h-24 flex justify-between items-center gap-4 sm:gap-8">
                    <span class="text-2xl font-bold">{{ Number.isNaN(profitFactor) ? 0 : profitFactor.toFixed(2) }}</span>
                    <UBadge v-if="profitFactor <= 1" label="Bad" variant="subtle" size="lg" color="red"/>
                    <UBadge v-else-if="profitFactor <= 1.5" label="Poor" variant="subtle" size="lg" color="red"/>
                    <UBadge v-else-if="profitFactor <= 2" label="Average" variant="subtle" size="lg" color="orange"/>
                    <UBadge v-else-if="profitFactor <= 3" label="Good" variant="subtle" size="lg" color="green"/>
                    <UBadge v-else-if="profitFactor <= 4" label="Great" variant="subtle" size="lg" color="green"/>
                    <UBadge v-else-if="profitFactor > 4" label="Excellent" variant="subtle" size="lg" color="green"/>
                    <UBadge v-else label="None" variant="subtle" size="lg" color="gray"/>
                </div>
            </UCard>
            <UCard>
                <template #header>
                    <div class="h-4 md:h-6 flex items-center gap-2">
                        <span class="text-sm">Real Risk Reward</span>
                        <UTooltip text="Average win to loss ratio per trade">
                            <UIcon name="i-heroicons-information-circle"/>
                        </UTooltip>
                    </div>
                </template>
                <div class="h-16 md:h-24 flex justify-between items-center gap-4 sm:gap-8">
                    <span class="text-2xl font-bold">{{ Number.isNaN(realRr) ? 0 : realRr.toFixed(2) }}</span>
                    <div class="w-full flex flex-col gap-1">
                        <UProgress 
                            :value="Number.isNaN(avgWin) ? 0.5 : avgWin" 
                            :max="(Number.isNaN(avgWin) ? 0 : avgWin) + Math.abs(avgLose)" 
                            color="green" 
                            :ui="{ progress: { track: '[&::-webkit-progress-bar]:bg-red-500 [&::-webkit-progress-bar]:dark:bg-red-500 [@supports(selector(&::-moz-progress-bar))]:bg-red-500 [@supports(selector(&::-moz-progress-bar))]:dark:bg-red-500' } }"
                        />
                        <div class="flex justify-between items-center">
                            <span class="font-medium text-green-500">{{ `+${Number.isNaN(avgWin) ? (0).toFixed(2) : avgWin.toFixed(2)} €` }}</span>
                            <span class="font-medium text-red-500">{{ `-${Math.abs(avgLose).toFixed(2)} €` }}</span>
                        </div>
                    </div>
                </div>
            </UCard>
        </div>
        <UCard>
            <UTable :sort="sort" :columns="columns" :rows="rows" :empty-state="{ icon: 'i-heroicons-circle-stack', label: 'No trades' }">
                <template #open-data="{ row }">
                    <span>{{ `${row.open.toDateString()} ${row.open.toLocaleTimeString([], { timeStyle: "short" })}` }}</span>
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
                <UPagination v-model="page" :page-count="tradesPerPage" :total="accounts[selectedAccountId]?.trades.length ?? 0" :max="3"/>
            </div>
        </UCard>
    </div>
    <div v-else class="grid place-items-center gap-2">
        <p>You have no trading accounts</p>
        <UButton @click="isAddAccountModalOpen = true" label="Add a trading account" icon="i-heroicons-user-plus"/>
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
                    <span class="text-sm">{{ `${previewedTrade.open.toDateString()} ${previewedTrade.open.toLocaleTimeString([], { timeStyle: "short" })}` }}</span>
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
            <template v-if="previewedTrade && previewedTrade.strategy && previewedTrade.tags.length > 0" #footer>
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
    definePageMeta({ layout: "app" });

    const clipboard = useCopyToClipboard();
    const toast = useToast();
    const accounts = useAccounts();
    const selectedAccountId = useSelectedAccountId();
    const editedTrade = useEditedTrade();
    const isAddAccountModalOpen = useIsAddAccountModalOpen();

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

    const tradeActions = (trade : Trade) => [
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
                click: () => accounts.value[selectedAccountId.value]?.trades.push(trade),
            },
        ],
        [
            {
                label: "Delete",
                icon: "i-heroicons-trash",
                click: () => {
                    if (accounts.value[selectedAccountId.value]) {
                        accounts.value[selectedAccountId.value].trades = 
                            accounts.value[selectedAccountId.value].trades.filter(t => t !== trade);
                    }
                },
            },
        ],
    ];

    const tradesPerPage: number = 10;
    const page = ref<number>(1);

    const isSlideoverOpen = ref<boolean>(false);
    const previewedTrade = ref<Trade | null>(null);

    const sort = ref<{ column: keyof Trade; direction: "asc" | "desc" }>({
        column: "open",
        direction: "desc",
    });

    const chart = ref();
    
    const chartOption = computed<ECOption>(() => ({
        xAxis: {
            type: "category",
            boundaryGap: false,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
        },
        yAxis: { 
            type: "value",
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
        },
        series: [{
            data: cumulativePnl.value,
            type: "line",
            areaStyle: {},
            smooth: true,
        }],
        grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        }
    }));

    const rows = computed<Trade[]>(() => {
        const { column, direction } = sort.value;
        if (accounts.value[selectedAccountId.value]) {
            return useOrderBy(accounts.value[selectedAccountId.value].trades, column, direction).slice((page.value - 1) * tradesPerPage, (page.value) * tradesPerPage);
        } else {
            return [];
        }
    });

    const winTrades = computed<Trade[]>(() => accounts.value[selectedAccountId.value]?.trades.filter(trade => trade.pnl && trade.pnl > 0)  ?? []);
    const loseTrades = computed<Trade[]>(() => accounts.value[selectedAccountId.value]?.trades.filter(trade => trade.pnl && trade.pnl < 0) ?? []);
    const breakevenTrades = computed<Trade[]>(() => accounts.value[selectedAccountId.value]?.trades.filter(trade => trade.pnl === 0) ?? []);

    const grossProfit = computed<number>(() => winTrades.value.reduce((acc, trade) => acc + (trade.pnl ?? 0), 0));
    const grossLoss = computed<number>(() => loseTrades.value.reduce((acc, trade) => acc + Math.abs(trade.pnl ?? 0), 0));

    const totalPnl = computed<number>(() => accounts.value[selectedAccountId.value]?.trades.reduce((acc, trade) => acc + (trade.pnl ?? 0), 0) ?? 0);
    const winRate = computed<number>(() => (winTrades.value.length / accounts.value[selectedAccountId.value]?.trades.length) * 100 ?? 0);
    const breakevenRate = computed<number>(() => (breakevenTrades.value.length / accounts.value[selectedAccountId.value]?.trades.length) * 100 ?? 0);
    const profitFactor = computed<number>(() => grossProfit.value / grossLoss.value);

    const avgWin = computed<number>(() => winTrades.value.reduce((acc, trade) => acc + (trade.pnl ?? 0), 0) / winTrades.value.length);
    const avgLose = computed<number>(() => {
        const value = loseTrades.value.reduce((acc, trade) => acc + (trade.pnl ?? 0), 0) / loseTrades.value.length;
        if (value) {
            return value;
        } else {
            return 0;
        }
    });
    const realRr = computed<number>(() => Math.abs(avgWin.value / avgLose.value));

    onMounted(() => {
        window.addEventListener("resize", handleResize);

        const canvas = chart.value.getDom().querySelector("canvas") as HTMLCanvasElement;

        if (canvas) {
            canvas.classList.add("rounded-lg")
        }

        onBeforeUnmount(() => window.removeEventListener("resize", handleResize));

        function handleResize() {
            chart.value.resize();
        }
    });
</script>