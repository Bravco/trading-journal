<template>
    <div class="w-full h-full flex flex-col border-r border-gray-200 dark:border-gray-800">
        <div class="flex items-stretch gap-2 p-4">
            <slot name="closeButton"></slot>
            <UDropdown class="w-full min-w-max" mode="hover" :items="tradingAccountsItems">
                <UButton class="w-full" icon="i-heroicons-user" label="Trading Accounts" variant="ghost" color="gray"/>
            </UDropdown>
        </div>
        <UDivider class="px-4"/>
        <UVerticalNavigation class="p-4" :links="navLinks"/>
        <div class="mt-auto p-4">
            <UDivider class="py-4"/>
            <UDropdown class="w-full" mode="hover" :items="userItems">
                <UButton class="w-full" label="John Doe" variant="ghost" color="gray">
                    <template #leading>
                        <UAvatar size="xs"/>
                    </template>
                    <template #trailing>
                        <UIcon class="w-5 h-5 ml-auto" name="i-heroicons-ellipsis-vertical"/>
                    </template>
                </UButton>
                <template #account="{ item }">
                    <div class="text-left">
                        <p>Signed in as</p>
                        <p class="truncate font-medium text-gray-900 dark:text-white">{{ item.label }}</p>
                    </div>
                </template>
            </UDropdown>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { signOut } from "firebase/auth";

    const auth = useFirebaseAuth()!;

    const tradingAccountsItems = [
        [
            { label:"Fusion Markets" },
            { label:"1of1 Funding" },
            { label:"Tradovate" },
        ],
        [
            { label:"Add Account", icon:"i-heroicons-plus-circle", iconClass: "order-1 ml-auto" },
            { label:"Manage Accounts", icon:"i-heroicons-cog-6-tooth", iconClass: "order-1 ml-auto" }
        ],
    ];

    const navLinks = [
        { label: "Dashboard", icon: "i-heroicons-squares-2x2", active: true },
        { label: "Analytics", icon: "i-heroicons-chart-bar" },
    ];

    const userItems = [
        [{ label:"johndoe@example.com", slot:"account", disabled:true }],
        [{
            label:"Sign out",
            icon:"i-heroicons-arrow-right-on-rectangle",
            iconClass: "order-1 ml-auto",
            click: () => signOut(auth),
        }],
    ];
</script>