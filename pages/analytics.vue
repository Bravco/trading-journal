<template>
    <div class="flex flex-col gap-6">
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <WinRate/>
            <ProfitFactor/>
            <RealRR/>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 grid-rows-1 xl:grid-rows-2 gap-6">
            <CumulativeNetPnl class="col-span-1 md:col-span-2 xl:col-span-3 row-span-1 xl:row-span-2"/>
            <AvgDayResult class="col-span-1 xl:col-span-2"/>
            <VolumeWinRateCorrelation class="col-span-1 xl:col-span-2"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
    definePageMeta({ layout: "app" });
</script>