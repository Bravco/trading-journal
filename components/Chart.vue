<template>
    <VChart 
        ref="chart" 
        :option="option" 
        :autoresize="true"
        v-on:rendered="() => renderChart()"
    />
</template>

<script lang="ts" setup>
    defineProps<{ option: ECOption }>();

    const chart = ref();

    function renderChart() {
        if (chart.value) {
            const canvas = chart.value.getDom().querySelector("canvas") as HTMLCanvasElement;
            if (canvas) canvas.classList.add("rounded-b-lg");
        }
    }
</script>