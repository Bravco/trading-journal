<template>
    <header>
        <UContainer class="max-w-full py-4 lg:py-6 mb-0 sm:mb-4 bg-background/75 backdrop-blur border-b sticky top-0 z-50 border-primary-200 dark:border-primary-800">
            <div class="flex justify-between items-center">
                <h1 class="text-xl font-bold">Trading <span class="text-primary">Journal</span></h1>
                <UButton label="New Trade" icon="i-ph-plus-duotone"/>
            </div>
        </UContainer>
    </header>
    
    <main>
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
    </main>

    <footer></footer>
</template>

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