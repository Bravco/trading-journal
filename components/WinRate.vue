<template>
    <UCard>
        <template #header>
            <div class="h-4 md:h-6 flex justify-between items-center">
                <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <span class="text-sm font-medium">Win Rate</span>
                    <UTooltip text="Percentage of winning trades">
                        <UIcon name="i-heroicons-information-circle"/>
                    </UTooltip>
                </div>
                <UTooltip text="Total number of trades">
                    <UBadge :label="filteredTrades.length ?? 0" variant="solid" color="gray"/>
                </UTooltip>
            </div>
        </template>
        <div class="h-16 md:h-24 flex justify-between items-center gap-4 sm:gap-8">
            <span class="text-2xl font-medium">{{ `${(Number.isNaN(winRate) ? 0 : winRate).toFixed(2)}%` }}</span>
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
</template>

<script lang="ts" setup>
    const winTrades = computed<any[]>(() => filteredTrades.value.filter(trade => trade.pnl && trade.pnl > 0));
    const loseTrades = computed<any[]>(() => filteredTrades.value.filter(trade => trade.pnl && trade.pnl < 0));
    const breakevenTrades = computed<any[]>(() => filteredTrades.value.filter(trade => trade.pnl === 0));

    const winRate = computed<number>(() => (winTrades.value.length / filteredTrades.value.length) * 100 ?? 0);
    const breakevenRate = computed<number>(() => (breakevenTrades.value.length / filteredTrades.value.length) * 100 ?? 0);
</script>