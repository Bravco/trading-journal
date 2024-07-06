<template>
    <header>
        <UContainer class="max-w-full py-4 lg:py-6 mb-0 sm:mb-4 bg-background/75 backdrop-blur border-b sticky top-0 z-50 border-primary-200 dark:border-primary-800">
            <div class="flex justify-between items-center">
                <h1 class="text-xl font-bold">Trading <span class="text-primary">Journal</span></h1>
                <div class="flex items-center gap-4">
                    <UButton @click="" label="New Strategy" icon="i-ph-chart-line-up-duotone" variant="soft"/>
                    <UButton @click="" label="New Trade" icon="i-ph-plus-duotone"  variant="solid"/>
                </div>
            </div>
        </UContainer>
    </header>
    
    <main>
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
    </main>

    <footer>
        <UContainer class="max-w-full py-4 mt-4 sm:mt-10 bg-background/75 backdrop-blur border-t border-primary-200 dark:border-primary-800 flex justify-center items-center text-sm">
            <span>Copyright &copy; {{ new Date().getFullYear() }} | Created by</span>
            <UButton 
                to="https://hamracek.dev" 
                label="Andrej Hamráček" 
                variant="link"
                target="_blank"
            />
        </UContainer>
    </footer>
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