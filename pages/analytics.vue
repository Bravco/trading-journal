<template>
    <div class="flex flex-col gap-6">
        <Details/>
        <UCard :ui="{ body: { padding: 'px-0 sm:px-0 sm:py-6' } }">
            <div class="px-4 pb-4 sm:px-6 sm:pb-6">
                <span :class="['text-3xl', 'font-bold', { 'text-green-500': totalPnl > 0 }, { 'text-red-500': totalPnl < 0 }]">
                    {{ `${totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)} €` }}
                </span>
            </div>
            <VChart 
                v-if="cumulativePnl.length > 1"
                :option="chartOption" 
                :autoresize="true"
                class="h-96"
            />
        </UCard>
    </div>
</template>

<script lang="ts" setup>
    definePageMeta({ layout: "app" });

    const trades = useTrades();

    const chartOption = computed<ECOption>(() => ({
        xAxis: {
            type: "category",
            data: cumulativePnl.value.map(obj => obj.date.toDateString()),
            axisTick: { alignWithLabel: true },
            boundaryGap: false,
            splitLine: {
                show: true,
                lineStyle: { opacity: 0.1 },
            },
            axisLine: { show: false },
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
            right: 1,
            bottom: 20,
        },
        tooltip: {
            trigger: "axis",
            backgroundColor: "rgb(17, 24, 39)",
            borderColor: "rgb(31, 41, 55)",
            textStyle: { color: "white" },
            axisPointer: {
                lineStyle: {
                    type: "solid",
                    color: "rgb(96, 165, 250)",
                },
            },
            formatter: function(params: any) {
                const date = params[0].name;
                const pnl = params[0].value;
                return `
                    ${date}<br>
                    <b class="font-bold ${pnl === 0 ? '' : (pnl > 0 ? 'text-green-500' : 'text-red-500')}">
                        ${pnl.toFixed(2)} €
                    </b>
                `;
            },
        },
    }));

    const totalPnl = computed<number>(() => trades.value.reduce((acc, trade) => acc + (trade.pnl ?? 0), 0)) ?? 0;

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
</script>