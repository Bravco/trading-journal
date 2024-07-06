<template>
    <header>
        <UContainer class="max-w-full py-4 lg:py-6 mb-0 sm:mb-4 bg-background/75 backdrop-blur border-b sticky top-0 z-50 border-gray-200 dark:border-gray-800">
            <div class="flex justify-between items-center">
                <h1 class="text-xl font-bold">Trading <span class="text-primary">Journal</span></h1>
                <UDropdown :items="addActions">
                    <UButton icon="i-heroicons-plus" variant="solid" size="lg" :ui="{ rounded: 'rounded-full' }"/>
                </UDropdown>
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
            <span>
                Copyright &copy; {{ new Date().getFullYear() }} | Created by
                <ULink 
                    to="https://hamracek.dev" 
                    target="_blank"
                    class="underline hover:text-primary"
                >Andrej Hamráček</ULink>
            </span>
        </UContainer>
    </footer>
</template>

<script lang="ts" setup>
    const addActions = [[
        {
            label: "New Strategy",
            icon: "i-heroicons-presentation-chart-line",
            click: () => console.log("New Strategy"),
        },
        {
            label: "New Trade",
            icon: "i-heroicons-document-plus",
            click: () => console.log("New Trade"),
        },
    ]];
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