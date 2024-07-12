<template>
    <div class="fixed inset-0 flex overflow-auto">
        <aside class="min-w-64 hidden lg:block"><Sidebar/></aside>
        <div class="w-full grid">
            <header>
                <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
                    <div class="flex items-stretch gap-2">
                        <UButton class="lg:hidden" @click="isSidebarSlideoverOpen = true" icon="i-heroicons-bars-3" variant="ghost" color="gray" square/>
                        <h1 class="text-xl font-bold">Trading <span class="text-primary">Journal</span></h1>
                    </div>
                    <UButton @click="openSlideover" label="New Trade" icon="i-heroicons-document-plus" variant="solid"/>
                </div>
            </header>
            <div class="overflow-y-auto p-4">
                <main>
                    <NuxtLayout>
                        <NuxtPage/>
                    </NuxtLayout>
                </main>
                <footer>
                    <div class="w-full mt-4 text-center text-sm">Copyright &copy; 2024</div>
                </footer>
            </div>
        </div>
    </div>
    <USlideover v-model="isSidebarSlideoverOpen" side="left">
        <Sidebar>
            <template #closeButton>
                <UButton class="lg:hidden" @click="isSidebarSlideoverOpen = false" icon="i-heroicons-bars-3" variant="ghost" color="gray" square/>
            </template>
        </Sidebar>
    </USlideover>
    <USlideover v-model="isTradeSlideoverOpen" :ui="{ width: 'max-w-xl' }">
        <UCard class="h-full" :ui="{ rounded: 'rounded-none' }">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-document-plus"/>
                        <h1 class="text-lg font-medium">{{ editedTrade === null ? "New Trade" : "Edit Trade" }}</h1>
                    </div>
                    <UButton @click="closeSlideover" icon="i-heroicons-x-mark" variant="ghost" color="gray"/>
                </div>
            </template>
            <UForm @submit="onSubmit" @keydown.enter="$event.preventDefault()" :schema="schema" :state="state" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <UFormGroup label="Open Date" name="open" required>
                        <UInput v-model="state.open" type="datetime-local"/>
                    </UFormGroup>
                    <UFormGroup label="Symbol" name="symbol" required>
                        <UInput v-model="state.symbol" type="text"/>
                    </UFormGroup>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <UFormGroup label="Risk Reward" name="rr" required>
                        <UInput v-model="state.rr" type="decimal" min="0"/>
                    </UFormGroup>
                    <UFormGroup label="Original Risk" name="risk" required>
                        <UInput v-model="state.risk" type="decimal" min="0"/>
                    </UFormGroup>
                    <UFormGroup label="Net P&L" name="pnl" required>
                        <UInput v-model="state.pnl" type="decimal"/>
                    </UFormGroup>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <UFormGroup label="Image Url" name="imageUrl" required>
                        <UInput v-model="state.imageUrl" type="text"/>
                    </UFormGroup>
                    <UFormGroup label="Strategy" name="strategy" required>
                        <UInput v-model="state.strategy" type="text">
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
                        <UInput @keydown.enter="pushNewTag" v-model="state.tagLabel" type="text" class="w-full">
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
                            <UButton icon="i-heroicons-swatch" variant="ghost" :color="state.tagColor ?? 'gray'"/>
                            <template v-for="color in colors" #[color]="{}">
                                <UTooltip :text="color" class="capitalize">
                                    <span :class="['inline-block', 'w-3', 'h-3', 'rounded-full', `bg-${color}-500`]"/>
                                </UTooltip>
                            </template>
                        </UDropdown>
                        <UButton @click="pushNewTag" icon="i-heroicons-plus"/>
                    </div>
                    <div class="min-h-11 flex flex-wrap gap-2 mt-2 p-2.5 rounded-md ring-1 ring-inset ring-gray-300 dark:ring-gray-700">
                        <UBadge 
                            v-for="tag in state.tags" 
                            @click="state.tags = state.tags.filter((t: Tag) => t !== tag)" 
                            :label="tag.label" 
                            :color="tag.color" 
                            variant="subtle" 
                            class="h-fit cursor-pointer"
                        />
                    </div>
                </UFormGroup>
                <UDivider/>
                <UButton 
                    type="submit" 
                    :label="editedTrade === null ? 'Create' : 'Save'" 
                    :icon="editedTrade === null ? 'i-heroicons-plus' : 'i-heroicons-check'"
                />
            </UForm>
        </UCard>
    </USlideover>
    <UNotifications/>
</template>

<script lang="ts" setup>
    import { object, string, number, date, array } from "yup";

    const trades = useTrades();
    const editedTrade = useEditedTrade();

    const schema = object({
        open: date().required("Open Date is required"),
        symbol: string().required("Symbol is required"),
        strategy: string().required("Strategy is required"),
        risk: number().positive("Original Risk must be a positive number").required("Original Risk is required"),
        rr: number().positive("Risk Reward must be a positive number").required("Risk Reward is required"),
        pnl: number().required("Net P&L is required"),
        imageUrl: string().url("Image Url must be a valid URL").required("Image Url is required"),
        tagLabel: string(),
        tagColor: string(),
        tags: array(),
    });

    const initialState: any = {
        open: undefined,
        symbol: undefined,
        strategy: undefined,
        risk: undefined,
        rr: undefined,
        pnl: undefined,
        imageUrl: undefined,
        tagLabel: undefined,
        tagColor: undefined,
        tags: [],
    };
    
    const state = reactive<any>({ ...initialState });

    const strategyOptions = computed<any>(() => [
        strategies.value.map(strategy => ({
            label: strategy,
            click: () => state.strategy = strategy,
        })),
    ]);

    const tagOptions = computed<any[]>(() => [
        tags.value.map(tag => ({
            label: tag.label,
            slot: tag.color,
            click: () => state.tags.push(tag),
        })),
    ]);

    const colorOptions: any[] = [
        colors.map(color => ({
            slot: color,
            click: () => state.tagColor = color,
        })),
    ];

    const isSidebarSlideoverOpen = ref<boolean>(false);
    const isTradeSlideoverOpen = ref<boolean>(false);

    function openSlideover() {
        function formatOpenDate(date: Date) {
            const isoString = date.toISOString().substring(0, 11); // YYYY-MM-DDT
            const timeString = date.toLocaleTimeString().substring(0, 5); // HH:MM
            return isoString + timeString;
        }

        if (editedTrade.value === null) {
            state.open = formatOpenDate(new Date());
        } else {
            Object.assign(state, {
                ...initialState,
                ...editedTrade.value,
                open: formatOpenDate(editedTrade.value.open),
            });
        }

        isTradeSlideoverOpen.value = true;
    }

    function closeSlideover() {
        Object.assign(state, initialState);
        state.tags = [];
        editedTrade.value = null;
        isTradeSlideoverOpen.value = false;
    }

    function pushNewTag() {
        if (typeof state.tagLabel === "string" && state.tagLabel.trim().length > 0) {
            state.tags.push({
                label: state.tagLabel,
                color: state.tagColor ?? "gray",
            });
            state.tagLabel = undefined;
            state.tagColor = undefined;
        }
    }

    async function onSubmit() {
        const newTrade: Trade = {
            open: new Date(state.open),
            symbol: state.symbol,
            strategy: state.strategy,
            risk: parseFloat(state.risk),
            rr: parseFloat(state.rr),
            pnl: parseFloat(state.pnl),
            imageUrl: state.imageUrl,
            tags: state.tags ?? [],
        };

        if (editedTrade.value === null) {
            trades.value.push(newTrade);
        } else {
            const index = useFindIndex(trades.value, trade => isEqual(trade, editedTrade.value));
            
            if (index !== -1) {
                trades.value[index] = newTrade;
            }
        }
        
        closeSlideover();
    }

    watch(editedTrade, () => {
        if (editedTrade.value !== null) {
            openSlideover();
        }
    });
</script>