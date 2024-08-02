<template>
    <UCard>
        <template #header>
            <div class="h-4 md:h-6 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span class="text-sm font-medium">Volume & Win Rate Correlation</span>
                <UTooltip text="Correlation between time-based volume and win rate">
                    <UIcon name="i-heroicons-information-circle"/>
                </UTooltip>
            </div>
        </template>
        <VChart 
            :option="chartOption" 
            :autoresize="true"
            class="h-32"
        />
    </UCard>
</template>

<script lang="ts" setup>
    const data = computed<{ maxVolume: number, volume: number[], winRate: number[] }>(() => {
        const hourlyStats = Array.from({ length: 24 }, () => ({ count: 0, wins: 0 }));

        filteredTrades.value.forEach(trade => {
            const hour = trade.open.toDate().getHours();
            hourlyStats[hour].count += 1;
            if (trade.pnl && trade.pnl > 0) {
                hourlyStats[hour].wins += 1;
            }
        });

        const maxVolume = Math.max(...hourlyStats.map(stat => stat.count));
        const volume = hourlyStats.map(stat => stat.count / maxVolume);
        const winRate = hourlyStats.map(stat => (stat.count > 0 ? stat.wins / stat.count : 0));

        return {
            maxVolume,
            volume,
            winRate,
        };
    });

    const chartOption = computed<ECOption>(() => ({
        xAxis: {
            type: "category",
            axisTick: { show: false },
            boundaryGap: false,
            axisLine: { show: false },
            axisLabel: {
                showMinLabel: true,
                showMaxLabel: true,
                alignMinLabel: "left",
                alignMaxLabel: "right",
                formatter: (value: any, _) => `${value}:00`,
            },
        },
        yAxis: { 
            type: "value",
            axisLabel: { show: false },
            splitLine: { show: false },
        },
        series: [
            {
                data: data.value.volume,
                type: "line",
                smooth: true,
                showSymbol: false,
                silent: true,
                lineStyle: { color: "rgb(107, 114, 128)" },
                emphasis: { disabled: true },
                tooltip: { valueFormatter: (value: any, _) => `${value * data.value.maxVolume}` },
            },
            {
                data: data.value.winRate,
                type: "line",
                smooth: true,
                showSymbol: false,
                silent: true,
                emphasis: { disabled: true },
                lineStyle: { color: "rgb(96, 165, 250)" },
                tooltip: { valueFormatter: (value: any, _) => `${(value * 100).toFixed(2)}%` },
            },
        ],
        grid: {
            left: 0,
            top: 1,
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
                    color: "gray",
                },
            },
            formatter: (params: any) => {
                const hour = params[0].name;
                const volume = params[0].value * data.value.maxVolume;
                const winRate = params[1].value * 100;
                return `
                    ${hour}:00<br>
                    Trades: <b class="text-gray-500">${volume}</b><br>
                    Win Rate: <b class="text-green-500">${winRate.toFixed(2)}%</b>
                `;
            },
        },
    }));
</script>