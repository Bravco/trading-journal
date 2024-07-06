<template>
    <div>
        <UContainer class="max-w-full pt-4 lg:pt-6">
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <UCard>
                    <template #header>
                        <div class="h-4 md:h-6 flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <span class="text-sm">Net P&L</span>
                                <UTooltip text="Total of all profits and losses">
                                    <UIcon name="i-ph-info-duotone"/>
                                </UTooltip>
                            </div>
                            <UTooltip text="Total number of trades">
                                <UBadge variant="soft">{{ trades.length }}</UBadge>
                            </UTooltip>
                        </div>
                    </template>
                    <span :class="['text-3xl', 'font-bold', { 'text-green-500': totalPnl > 0 }, { 'text-red-500': totalPnl < 0 }]">
                        {{ `${totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)} €` }}
                    </span>
                </UCard>
                <UCard>
                    <template #header>
                        <div class="h-4 md:h-6 flex items-center gap-2">
                            <span class="text-sm">Win Rate</span>
                            <UTooltip text="Percentage of winning trades">
                                <UIcon name="i-ph-info-duotone"/>
                            </UTooltip>
                        </div>
                    </template>
                    <span class="text-2xl font-bold">{{ `${winRate.toFixed(2)}%` }}</span>
                </UCard>
                <UCard>
                    <template #header>
                        <div class="h-4 md:h-6 flex items-center gap-2">
                            <span class="text-sm">Profit Factor</span>
                            <UTooltip text="Ratio of the total gross profit to the total gross loss">
                                <UIcon name="i-ph-info-duotone"/>
                            </UTooltip>
                        </div>
                    </template>
                    <span class="text-2xl font-bold">{{ profitFactor.toFixed(2) }}</span>
                </UCard>
                <UCard>
                    <template #header>
                        <div class="h-4 md:h-6 flex items-center gap-2">
                            <span class="text-sm">Real Risk Reward</span>
                            <UTooltip text="Average win to loss ratio per trade">
                                <UIcon name="i-ph-info-duotone"/>
                            </UTooltip>
                        </div>
                    </template>
                    <div class="flex items-center gap-8">
                        <span class="text-2xl font-bold">{{ realRr.toFixed(2) }}</span>
                        <div class="w-full flex flex-col gap-1">
                            <UProgress :value="avgWin" :max="avgWin + Math.abs(avgLose)" color="green" :ui="{ progress: { track: '[&::-webkit-progress-bar]:bg-red-500 [&::-webkit-progress-bar]:dark:bg-red-500 [@supports(selector(&::-moz-progress-bar))]:bg-red-500 [@supports(selector(&::-moz-progress-bar))]:dark:bg-red-500' } }"/>
                            <div class="flex justify-between items-center">
                                <span class="font-medium text-green-500">{{ `+${avgWin.toFixed(2)} €` }}</span>
                                <span class="font-medium text-red-500">{{ `${avgLose.toFixed(2)} €` }}</span>
                            </div>
                        </div>
                    </div>
                </UCard>
            </div>
            <UCard>
                <UTable :sort="sort" :columns="columns" :rows="rows" :empty-state="{ icon: 'i-ph-stack-simple-duotone', label: 'No trades' }">
                    <template #open-data="{ row }">
                        <span>{{ `${row.open.toDateString()} ${row.open.toLocaleTimeString([], { timeStyle: "short" })}` }}</span>
                    </template>
                    <template #pnl-data="{ row }">
                        <span :class="['font-medium', { 'text-green-500': row.pnl > 0 }, { 'text-red-500': row.pnl < 0 }]">
                            {{ `${row.pnl >= 0 ? "+" : ""}${row.pnl.toFixed(2)} €` }}
                        </span>
                    </template>
                    <template #rr-data="{ row }">
                        <span>{{ row.rr.toFixed(2) }}</span>
                    </template>
                    <template #result-data="{ row }">
                        <UBadge v-if="row.pnl > 0" variant="soft" color="green">Win</UBadge>
                        <UBadge v-if="row.pnl < 0" variant="soft" color="red">Lose</UBadge>
                        <UBadge v-if="row.pnl == 0" variant="soft" color="blue">Breakeven</UBadge>
                    </template>
                    <template #imageUrl-data="{ row }">
                        <ULink :to="row.imageUrl" class="flex items-center gap-1 hover:text-primary" target="_blank">
                            <UIcon name="i-ph-link-simple-duotone"/>
                            <span>Open Link</span>
                        </ULink>
                    </template>
                </UTable>
                <div class="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                    <UPagination v-model="page" :page-count="tradesPerPage" :total="trades.length" :max="3"/>
                </div>
            </UCard>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
const columns = [
    { key: "open", label: "Open Date", sortable: true },
    { key: "symbol", label: "Symbol" },
    { key: "pnl", label: "Net P&L" },
    { key: "rr", label: "Risk Reward" },
    { key: "result", label: "Result" },
    { key: "imageUrl", label: "Image Url" },
];

const trades = [
    {
        open: new Date("2024-07-05T15:35:00"),
        symbol: "NQ",
        pnl: 10.72,
        rr: 2.1,
        imageUrl: "https://www.tradingview.com/x/IqNKyxNQ/",
    },
    {
        open: new Date("2024-07-05T19:58:00"),
        symbol: "YM",
        pnl: 5.13,
        rr: 1.17,
        imageUrl: "https://www.tradingview.com/x/IqNKyxNQ/",
    },
    {
        open: new Date("2024-07-04T14:24:00"),
        symbol: "GBPUSD",
        pnl: -7.64,
        rr: 3.08,
        imageUrl: "https://www.tradingview.com/x/IqNKyxNQ/",
    },
    {
        open: new Date("2024-07-03T15:11:00"),
        symbol: "EURUSD",
        pnl: -9.87,
        rr: 1.93,
        imageUrl: "https://www.tradingview.com/x/IqNKyxNQ/",
    },
    {
        open: new Date("2024-07-02T16:02:00"),
        symbol: "NQ",
        pnl: 24.12,
        rr: 3.29,
        imageUrl: "https://www.tradingview.com/x/IqNKyxNQ/",
    },
    {
        open: new Date("2024-07-02T19:41:00"),
        symbol: "NQ",
        pnl: 17.64,
        rr: 2.03,
        imageUrl: "https://www.tradingview.com/x/IqNKyxNQ/",
    },
    {
        open: new Date("2024-07-01T09:55:00"),
        symbol: "NQ",
        pnl: 20.94,
        rr: 2.53,
        imageUrl: "https://www.tradingview.com/x/IqNKyxNQ/",
    },
    {
        open: new Date("2024-06-28T20:45:00"),
        symbol: "YM",
        pnl: 0,
        rr: 1.94,
        imageUrl: "https://www.tradingview.com/x/IqNKyxNQ/",
    },
];

const tradesPerPage = 5;

const page = ref(1);

const sort = ref({
    column: "open",
    direction: "desc",
});

const rows = computed(() => trades.slice((page.value - 1) * tradesPerPage, page.value * tradesPerPage));

const winTrades = computed(() => trades.filter(trade => trade.pnl > 0));
const loseTrades = computed(() => trades.filter(trade => trade.pnl < 0));

const grossProfit = computed(() => winTrades.value.reduce((acc, trade) => acc + trade.pnl, 0));
const grossLoss = computed(() => loseTrades.value.reduce((acc, trade) => acc + Math.abs(trade.pnl), 0));

const totalPnl = computed(() => trades.reduce((acc, trade) => acc + trade.pnl, 0));
const winRate = computed(() => (winTrades.value.length / trades.length) * 100);
const profitFactor = computed(() => grossProfit.value / grossLoss.value);
//const avgRr = computed(() => trades.reduce((acc, trade) => acc + trade.rr, 0) / trades.length);
const avgWin = computed(() => winTrades.value.reduce((acc, trade) => acc + trade.pnl, 0) / winTrades.value.length);
const avgLose = computed(() => loseTrades.value.reduce((acc, trade) => acc + trade.pnl, 0) / loseTrades.value.length);
const realRr = computed(() => Math.abs(avgWin.value / avgLose.value));
</script>