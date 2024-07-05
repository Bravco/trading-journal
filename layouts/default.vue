<template>
    <div>
        <header>
            <UContainer class="mt-4">
                <h1 class="font-medium text-lg">Trading <span class="text-primary">Journal</span></h1>
            </UContainer>
        </header>
        <main>
            <UContainer class="mt-8">
                <slot/>
            </UContainer>
        </main>
        <footer></footer>
    </div>
</template>