<template>
    <UCard class="relative">
        <template #header>
            <div class="h-4 md:h-6 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span class="text-sm font-medium">Net P&L</span>
                <UTooltip text="Total of all profits and losses">
                    <UIcon name="i-heroicons-information-circle"/>
                </UTooltip>
            </div>
        </template>
        <div class="h-16 md:h-24 flex justify-between items-center gap-4 sm:gap-8">
            <span :class="['text-3xl', 'font-medium', { 'text-green-500': totalPnl > 0 }, { 'text-red-500': totalPnl < 0 }]">
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
            data: cumulativePnl.value,
            type: "line",
            smooth: true,
            showSymbol: false,
            silent: true,
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

    const totalPnl = computed<number>(() => trades.value.reduce((acc, trade) => acc + (trade.pnl ?? 0), 0)) ?? 0;

    const cumulativePnl = computed<number[]>(() => {
        const sortedTrades = trades.value.sort((a, b) => a.open.toDate().getTime() - b.open.toDate().getTime()) ?? [];
        const pnlValues = sortedTrades.map(trade => trade.pnl);
        return pnlValues.reduce((acc: number[], pnl) => {
            if (pnl) {
                if (acc.length === 0) {
                    acc.push(pnl);
                } else {
                    acc.push(acc[acc.length - 1] + pnl);
                }
            }
            return acc;
        }, []);
    });

    function renderChart() {
        if (chart.value) {
            const canvas = chart.value.getDom().querySelector("canvas") as HTMLCanvasElement;
            if (canvas) canvas.classList.add("rounded-b-lg");
        }
    }
</script>