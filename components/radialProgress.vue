<template>
    <div class="relative w-20 h-20 sm:w-24 sm:h-24">
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
                class="text-green-500 radial-progress-bar stroke-current"
                stroke-width="8"
                stroke-linecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke-dasharray="251.2" 
                :stroke-dashoffset="`calc(251.2px - (251.2px * ${progressPrimary}) / 100)`"
            ></circle>
            <circle
                class="text-blue-500 radial-progress-bar stroke-current"
                stroke-width="8"
                stroke-linecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke-dasharray="251.2"
                :stroke-dashoffset="`calc(251.2px + (251.2px * ${progressSecondary}) / 100)`"
            ></circle>
        </svg>
    </div>
</template>

<script lang="ts" setup>
    defineProps({
        progressPrimary: {
            type: Number,
            default: 0,
        },
        progressSecondary: {
            type: Number,
            default: 0,
        },
    });
</script>

<style scoped>
    .radial-progress-bar {
        transition: stroke-dashoffset 300ms;
        transform: rotate(180deg);
        transform-origin: 50% 50%;
    }
</style>