<template>
    <div>
        <div class="w-20 h-20 sm:w-24 sm:h-24 flex items-center">
            <svg class="w-full h-fit" viewBox="0 0 100 50">
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
                    :stroke-dashoffset="`calc(251.2px - (251.2px * ${progress / 2}) / 100)`"
                ></circle>
            </svg>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps({
        progress: {
            type: Number,
            default: 0,
        },
    });
</script>

<style scoped>
    .radial-progress-bar {
        transition: stroke-dashoffset 300ms;
        transform: rotate(180deg);
        transform-origin: 50% 100%;
    }
</style>