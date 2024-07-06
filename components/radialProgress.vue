<template>
    <div>
        <div class="relative w-24 h-24">
            <svg class="w-full h-full" viewBox="0 0 100 100">
                <circle
                    class="text-red-500 stroke-current"
                    stroke-width="8"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                ></circle>
                <circle
                    class="text-green-500 progress-ring__circle stroke-current"
                    stroke-width="8"
                    stroke-linecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke-dasharray="251.2" 
                    :stroke-dashoffset="`calc(251.2px - (251.2px * ${progress}) / 100)`"
                ></circle>
            </svg>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps({
        progress: Number,
    });
</script>

<style scoped>
    .progress-ring__circle {
        transition: stroke-dashoffset 0.35s;
        transform: rotate(180deg);
        transform-origin: 50% 50%;
    }
</style>