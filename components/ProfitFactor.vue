<template>
    <UCard>
        <template #header>
            <div class="h-4 md:h-6 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span class="text-sm font-medium">Profit Factor</span>
                <UTooltip text="Ratio of the total gross profit to the total gross loss">
                    <UIcon name="i-heroicons-information-circle"/>
                </UTooltip>
            </div>
        </template>
        <div class="h-16 md:h-24 flex justify-between items-center gap-4 sm:gap-8">
            <span class="text-2xl font-medium">{{ (Number.isNaN(profitFactor) ? 0 : profitFactor).toFixed(2) }}</span>
            <UBadge v-if="profitFactor <= 1" label="Bad" variant="subtle" size="lg" color="red"/>
            <UBadge v-else-if="profitFactor <= 1.5" label="Poor" variant="subtle" size="lg" color="red"/>
            <UBadge v-else-if="profitFactor <= 2" label="Average" variant="subtle" size="lg" color="orange"/>
            <UBadge v-else-if="profitFactor <= 3" label="Good" variant="subtle" size="lg" color="green"/>
            <UBadge v-else-if="profitFactor <= 4" label="Great" variant="subtle" size="lg" color="green"/>
            <UBadge v-else-if="profitFactor > 4" label="Excellent" variant="subtle" size="lg" color="green"/>
            <UBadge v-else label="None" variant="subtle" size="lg" color="gray"/>
        </div>
    </UCard>
</template>

<script lang="ts" setup>
    const winTrades = computed<any[]>(() => filteredTrades.value.filter(trade => trade.pnl && trade.pnl > 0));
    const loseTrades = computed<any[]>(() => filteredTrades.value.filter(trade => trade.pnl && trade.pnl < 0));

    const grossProfit = computed<number>(() => winTrades.value.reduce((acc, trade) => acc + (trade.pnl ?? 0), 0));
    const grossLoss = computed<number>(() => loseTrades.value.reduce((acc, trade) => acc + Math.abs(trade.pnl ?? 0), 0));

    const profitFactor = computed<number>(() => grossProfit.value / grossLoss.value);
</script>