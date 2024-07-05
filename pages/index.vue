<template>
    <div class="flex flex-col m-8 gap-6">
        <div class="flex justify-between items-center">
            <h1 class="font-bold text-xl">Trading <span class="text-primary">Journal</span></h1>
            <UButton label="New Trade" icon="i-ph-plus-duotone"/>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <UCard>
                <template #header>
                    <div class="h-4 md:h-6 flex justify-between items-center">
                        <div class="flex items-center gap-2">
                            <h2 class="text-sm text-gray-400">Net P&L</h2>
                            <UTooltip text="Total of all profits and losses">
                                <UIcon name="i-ph-info-duotone"/>
                            </UTooltip>
                        </div>
                        <UBadge variant="soft">100</UBadge>
                    </div>
                </template>
                <Placeholder class="h-24"/>
            </UCard>
            <UCard>
                <template #header>
                    <div class="h-4 md:h-6 flex items-center gap-2">
                        <h2 class="text-sm text-gray-400">Win Rate</h2>
                        <UTooltip text="Percentage of winning trades">
                            <UIcon name="i-ph-info-duotone"/>
                        </UTooltip>
                    </div>
                </template>
                <Placeholder class="h-24"/>
            </UCard>
            <UCard>
                <template #header>
                    <div class="h-4 md:h-6 flex items-center gap-2">
                        <h2 class="text-sm text-gray-400">Profit Factor</h2>
                        <UTooltip text="Ratio of the total gross profit to the total gross loss">
                            <UIcon name="i-ph-info-duotone"/>
                        </UTooltip>
                    </div>
                </template>
                <Placeholder class="h-24"/>
            </UCard>
            <UCard>
                <template #header>
                    <div class="h-4 md:h-6 flex items-center gap-2">
                        <h2 class="text-sm text-gray-400">Average Risk Reward</h2>
                        <UTooltip text="Average risk to reward ratio per trade">
                            <UIcon name="i-ph-info-duotone"/>
                        </UTooltip>
                    </div>
                </template>
                <Placeholder class="h-24"/>
            </UCard>
        </div>
        <UCard>
            <Placeholder class="h-96"/>
        </UCard>
    </div>
</template>