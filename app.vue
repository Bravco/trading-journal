<template>
    <header>
        <UContainer class="max-w-full py-4 lg:py-6 mb-0 sm:mb-4 bg-background/75 backdrop-blur border-b sticky top-0 z-50 border-gray-200 dark:border-gray-800">
            <div class="flex justify-between items-center">
                <h1 class="text-xl font-bold">Trading <span class="text-primary">Journal</span></h1>
                <UButton @click="isSlideoverOpen = true" label="New Trade" icon="i-heroicons-document-plus" variant="solid"/>
            </div>

        </UContainer>
    </header>
    <main>
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
    </main>
    <footer>
        <UContainer class="max-w-full py-4 lg:py-6 mt-4 sm:mt-10 bg-background/75 backdrop-blur border-t border-gray-200 dark:border-gray-800 flex justify-center items-center text-sm">
            <span>Copyright &copy; 2024</span>
        </UContainer>
    </footer>
    <USlideover v-model="isSlideoverOpen" :ui="{ width: 'max-w-xl' }">
        <UCard class="h-full" :ui="{ rounded: 'rounded-none' }">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-document-plus"/>
                        <h1 class="text-lg font-medium">New Trade</h1>
                    </div>
                    <UButton @click="isSlideoverOpen = false" icon="i-heroicons-x-mark" variant="ghost" color="gray"/>
                </div>
            </template>
            <UForm @submit="isSlideoverOpen = false" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <UFormGroup label="Symbol" name="symbol">
                        <UInput type="text"/>
                    </UFormGroup>
                    <UFormGroup label="Open Date" name="openDate">
                        <UInput type="date"/>
                    </UFormGroup>
                    <UFormGroup label="Open Time" name="openTime">
                        <UInput type="time"/>
                    </UFormGroup>
                    <UFormGroup label="Risk Reward" name="rr">
                        <UInput type="number" min="0"/>
                    </UFormGroup>
                    <UFormGroup label="Original Risk" name="risk">
                        <UInput type="number" min="0"/>
                    </UFormGroup>
                    <UFormGroup label="Net P&L" name="pnl">
                        <UInput type="number"/>
                    </UFormGroup>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <UFormGroup label="Image Url" name="imageUrl">
                        <UInput type="text"/>
                    </UFormGroup>
                    <UFormGroup label="Strategy" name="strategy">
                        <UInput v-model="strategyInput" type="text">
                            <template #trailing>
                                <UDropdown :items="strategyOptions" class="pointer-events-auto">
                                    <UIcon name="i-heroicons-chevron-down "/>
                                </UDropdown>
                            </template>
                        </UInput>
                    </UFormGroup>
                </div>
                <UFormGroup label="Tags" name="tags">
                    <div class="flex items-center justify-between gap-2">
                        <UButton @click="pushNewTag()" icon="i-heroicons-plus"/>
                        <UInput v-model="tagInputLabel" type="text" class="w-full">
                            <template #trailing>
                                <UDropdown :items="tagOptions" class="pointer-events-auto" :ui="{ width: 'w-fit' }">
                                    <UIcon name="i-heroicons-chevron-down "/>
                                    <template v-for="color in colors" #[color]="{ item: tag }">
                                        <UBadge :label="tag.label" :color="color" variant="subtle"/>
                                    </template>
                                </UDropdown>
                            </template>
                        </UInput>
                        <UDropdown :ui="{ width: 'w-fit', padding: 'grid grid-cols-5' }" :items="colorOptions">
                            <UButton icon="i-heroicons-swatch" variant="ghost" :color="tagInputColor"/>
                            <template v-for="color in colors" #[color]="{}">
                                <span :class="['inline-block', 'w-3', 'h-3', 'rounded-full', `bg-${color}-500`]"/>
                            </template>
                        </UDropdown>
                    </div>
                    <div class="min-h-11 flex flex-wrap gap-2 mt-2 p-2.5 rounded-md ring-1 ring-inset ring-gray-300 dark:ring-gray-700">
                        <UBadge v-for="tag in inputtedTags" :label="tag.label" :color="tag.color" variant="subtle" class="h-fit"/>
                    </div>
                </UFormGroup>
                <UDivider/>
                <UButton type="submit" label="Submit"/>
            </UForm>
        </UCard>
    </USlideover>
    <UNotifications/>
</template>

<script lang="ts" setup>
    const strategyOptions: any[] = [
        strategies.map(strategy => ({
            label: strategy,
            click: () => strategyInput.value = strategy,
        })),
    ];

    const tagOptions: any[] = [
        tags.map(tag => ({
            label: tag.label,
            slot: tag.color,
            click: () => {
                tagInputLabel.value = tag.label;
                tagInputColor.value = tag.color;
            },
        })),
    ];

    const colorOptions: any[] = [
        colors.map(color => ({
            slot: color,
            click: () => tagInputColor.value = color,
        })),
    ];

    const isSlideoverOpen = ref<boolean>(false);
    const strategyInput = ref<string | null>();
    const tagInputLabel = ref<string | null>(null);
    const tagInputColor = ref<string>(colors[0]);
    const inputtedTags = ref<Tag[]>([]);

    function pushNewTag() {
        if (tagInputLabel.value !== null && tagInputLabel.value !== "null" && tagInputColor.value !== null) {
            inputtedTags.value.push({
                label: tagInputLabel.value,
                color: tagInputColor.value,
            });
            tagInputLabel.value = null;
            tagInputColor.value = colors[0];
            console.log(inputtedTags.value);
        }
    }
</script>

<style>
    :root {
        --ui-background: 255 255 255;
        --ui-foreground: var(--color-gray-700);
    }

    .dark {
        --ui-background: var(--color-gray-900);
        --ui-foreground: var(--color-gray-200);
        color-scheme: dark;
    }

    body {
        --tw-bg-opacity: 1;
        background-color: rgb(var(--ui-background) / var(--tw-bg-opacity));
        --tw-text-opacity: 1;
        color: rgb(var(--ui-foreground) / var(--tw-text-opacity));
    }
</style>