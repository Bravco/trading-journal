<template>
    <UCard>
        <template #header>
            <div class="h-4 md:h-6 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span class="text-sm font-medium">Average Day Result</span>
                <UTooltip text="Average profit and loss for corresponding day">
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
    const chartOption = computed<ECOption>(() => {
        const emphasis = {
            itemStyle: {
                shadowBlur: 8,
                shadowColor: "gray",
            },
        };
        return {
            tooltip: {
                trigger: "item",
                backgroundColor: "rgb(17, 24, 39)",
                borderColor: "rgb(31, 41, 55)",
                textStyle: { color: "white" },
                axisPointer: {
                    lineStyle: {
                        type: "solid",
                        color: "rgb(96, 165, 250)",
                    },
                },
                valueFormatter(value: any, _) {
                    return `${value.toFixed(2)} €`;
                },
            },
            xAxis: {
                type: "category",
                data: avgResult.value.map(result => result.label),
                boundaryGap: false,
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: true, lineStyle: { opacity: 0.1 } },
            },
            yAxis: { 
                type: "value",
                show: false,
                axisLabel: { show: false },
            },
            series: [
                {
                    data: avgResult.value.map(result => result.profit),
                    type: "bar",
                    stack: "one",
                    color: "rgb(4, 197, 94)",
                    barMaxWidth: 16,
                    emphasis: emphasis,
                },
                {
                    data: avgResult.value.map(result => result.loss),
                    type: "bar",
                    stack: "one",
                    color: "rgb(239, 68, 68)",
                    barMaxWidth: 16,
                    emphasis: emphasis,
                },
            ],
            grid: {
                top: 0,
                bottom: 0,
                containLabel: true,
            },
        };
    });

    const avgResult = computed<{ label: string, profit: number, loss: number }[]>(() => {
        const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const daysOfWeek = dayLabels.map(label => ({
            label,
            profit: 0,
            loss: 0,
            profitCount: 0,
            lossCount: 0,
        }));

        filteredTrades.value.forEach(trade => {
            if (trade.pnl) {
                const dayOfWeek = trade.open.toDate().getDay();

                if (trade.pnl > 0) {
                    daysOfWeek[dayOfWeek].profit += trade.pnl;
                    daysOfWeek[dayOfWeek].profitCount++;
                } else if (trade.pnl < 0) {
                    daysOfWeek[dayOfWeek].loss += trade.pnl;
                    daysOfWeek[dayOfWeek].lossCount++;
                }
            }
        });

        return daysOfWeek.map(day => ({
            label: day.label,
            profit: day.profitCount > 0 ? day.profit / day.profitCount : 0,
            loss: day.lossCount > 0 ? day.loss / day.lossCount : 0,
        }));
    });
</script>