<template>
    <UCard>
        <template #header>
            <div class="h-4 md:h-6 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span class="text-sm font-medium">Real Risk Reward</span>
                <UTooltip text="Average win to loss ratio per trade">
                    <UIcon name="i-heroicons-information-circle"/>
                </UTooltip>
            </div>
        </template>
        <div class="h-16 md:h-24 flex justify-between items-center gap-4 sm:gap-8">
            <span class="text-2xl font-medium">{{ (Number.isNaN(realRr) ? 0 : realRr).toFixed(2) }}</span>
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
</template>

<script lang="ts" setup>
    const trades = useTrades();

    const winTrades = computed<any[]>(() => trades.value.filter(trade => trade.pnl && trade.pnl > 0));
    const loseTrades = computed<any[]>(() => trades.value.filter(trade => trade.pnl && trade.pnl < 0));

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
</script>