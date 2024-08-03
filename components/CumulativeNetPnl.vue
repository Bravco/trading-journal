<template>
    <UCard :ui="{ body: { padding: 'px-0 sm:px-0' } }">
        <div class="px-4 sm:px-6">
            <div class="flex flex-col">
                <div class="h-4 md:h-6 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <span class="text-sm font-medium ">Cumulative Net P&L</span>
                    <UTooltip text="Cumulative total of all profits and losses">
                        <UIcon name="i-heroicons-information-circle"/>
                    </UTooltip>
                </div>
                <span :class="['text-3xl', 'font-medium', { 'text-green-500': totalPnl > 0 }, { 'text-red-500': totalPnl < 0 }]">
                    {{ `${totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)} €` }}
                </span>
            </div>
        </div>
        <VChart 
            v-if="cumulativePnl.length > 1"
            :option="chartOption" 
            :autoresize="true"
            class="h-96"
        />
        <div v-else class="h-96 grid place-items-center">
            <div class="grid place-items-center">
                <UIcon class="w-6 h-6 text-gray-400 dark:text-gray-500 mb-4" name="i-heroicons-circle-stack"/>
                <span class="text-sm">Need more data</span>
            </div>
        </div>
    </UCard>
</template>

<script lang="ts" setup>
    const chartOption = computed<ECOption>(() => ({
        xAxis: {
            type: "category",
            data: cumulativePnl.value.map(obj => obj.date.toDateString()),
            axisTick: { show: false },
            boundaryGap: false,
            splitLine: {
                show: true,
                lineStyle: { opacity: 0.1 },
            },
            axisLine: { show: false },
            axisLabel: {
                alignMinLabel: "left",
                alignMaxLabel: "right",
            },
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
            silent: true,
            areaStyle: { opacity: 0.1, color: "rgb(96, 165, 250)" },
            lineStyle: { color: "rgb(96, 165, 250)" },
            itemStyle: { color: "rgb(96, 165, 250)" },
            emphasis: { disabled: true },
            
        }],
        grid: {
            left: 0,
            top: 0,
            right: 1,
            bottom: 0,
            containLabel: true,
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
                    <span class="font-bold ${pnl === 0 ? '' : (pnl > 0 ? 'text-green-500' : 'text-red-500')}">
                        ${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)} €
                    </span>
                `;
            },
        },
    }));

    const cumulativePnl = computed<{ date: Date, pnl: number }[]>(() => {
        const sortedTrades = filteredTrades.value.sort((a, b) => a.open.toDate().getTime() - b.open.toDate().getTime()) ?? [];
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