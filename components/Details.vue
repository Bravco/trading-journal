<template>
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
                <span :class="['text-3xl', 'font-bold', { 'text-green-500': totalPnl > 0 }, { 'text-red-500': totalPnl < 0 }]">
                    {{ `${totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)} €` }}
                </span>
            </div>
            <VChart 
                v-if="cumulativePnl.length > 1" 
                ref="chart" 
                :option="chartOption" 
                :autoresize="true"
                v-on:rendered="() => renderChart()"
                class="w-full h-1/6 absolute left-0 bottom-0"
            />
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
                        <UBadge :label="trades.length ?? 0" variant="solid" color="gray"/>
                    </UTooltip>
                </div>
            </template>
            <div class="h-16 md:h-24 flex justify-between items-center gap-4 sm:gap-8">
                <span class="text-2xl font-bold">{{ `${(Number.isNaN(winRate) ? 0 : winRate).toFixed(2)}%` }}</span>
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
                <span class="text-2xl font-bold">{{ (Number.isNaN(profitFactor) ? 0 : profitFactor).toFixed(2) }}</span>
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
                <span class="text-2xl font-bold">{{ (Number.isNaN(realRr) ? 0 : realRr).toFixed(2) }}</span>
                <div class="w-full flex flex-col gap-1">
                    <UProgress 
                        :value="Number.isNaN(avgWin) ? 0.5 : avgWin" 
                        :max="(Number.isNaN(avgWin) ? 1 : avgWin) + Math.abs(avgLose)" 
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
</template>

<script lang="ts" setup>
    const trades = useTrades();

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
            data: cumulativePnl.value.map(obj => obj.pnl),
            type: "line",
            smooth: true,
            showSymbol: false,
            areaStyle: { opacity: 0.1, color: "rgb(96, 165, 250)" },
            lineStyle: { color: "rgb(96, 165, 250)" },
        }],
        grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        }
    }));

    const winTrades = computed<any[]>(() => trades.value.filter(trade => trade.pnl && trade.pnl > 0));
    const loseTrades = computed<any[]>(() => trades.value.filter(trade => trade.pnl && trade.pnl < 0));
    const breakevenTrades = computed<any[]>(() => trades.value.filter(trade => trade.pnl === 0));

    const grossProfit = computed<number>(() => winTrades.value.reduce((acc, trade) => acc + (trade.pnl ?? 0), 0));
    const grossLoss = computed<number>(() => loseTrades.value.reduce((acc, trade) => acc + Math.abs(trade.pnl ?? 0), 0));
    const totalPnl = computed<number>(() => trades.value.reduce((acc, trade) => acc + (trade.pnl ?? 0), 0)) ?? 0;

    const winRate = computed<number>(() => (winTrades.value.length / trades.value.length) * 100 ?? 0);
    const breakevenRate = computed<number>(() => (breakevenTrades.value.length / trades.value.length) * 100 ?? 0);
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

    const cumulativePnl = computed<CumulativePnl[]>(() => {
        const sortedTrades = trades.value.sort((a, b) => a.open.toDate().getTime() - b.open.toDate().getTime()) ?? [];
        const pnlByDay: { [date: string]: number } = {};

        sortedTrades.forEach(trade => {
            const date = trade.open.toDate().toISOString().split("T")[0];
            const pnl = trade.pnl;

            if (pnl) {
                if (pnlByDay[date]) {
                    pnlByDay[date] += pnl;
                } else {
                    pnlByDay[date] = pnl;
                }
            }
        });

        let cumulativeTotal = 0;
        return Object.keys(pnlByDay).map(date => {
            cumulativeTotal += pnlByDay[date];
            return {
                date: new Date(date),
                pnl: cumulativeTotal,
            };
        });
    });

    function renderChart() {
        if (chart.value) {
            const canvas = chart.value.getDom().querySelector("canvas") as HTMLCanvasElement;
            if (canvas) canvas.classList.add("rounded-b-lg");
        }
    }
</script>