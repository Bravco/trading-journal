<template>
    <div>
        <UContainer class="flex justify-between gap-6 px-0 sm:px-0 lg:px-0">
            <UCard v-for="_ in 4" class="w-full">
                <template #header>
                    <Placeholder class="h-6"/>
                </template>
                <Placeholder class="h-24"/>
            </UCard>
        </UContainer>
    </div>
</template>