<template>
    <div class="w-full h-full flex flex-col border-r border-gray-200 dark:border-gray-800">
        <div class="flex items-stretch gap-2 p-4">
            <slot name="closeButton"></slot>
            <UDropdown class="w-full min-w-max" mode="hover" :items="tradingAccountsItems">
                <template #active="{ item }">
                    <span class="font-medium text-primary">{{ item.label }}</span>
                </template>
                <UButton class="w-full" icon="i-heroicons-user" label="Trading Accounts" variant="ghost" color="gray"/>
            </UDropdown>
        </div>
        <UDivider class="px-4"/>
        <UVerticalNavigation class="p-4" :links="navLinks"/>
        <div class="mt-auto p-4">
            <UDivider class="py-4"/>
            <UDropdown class="w-full" mode="hover" :items="userItems">
                <UButton class="w-full" :label="user?.displayName ?? user?.email" variant="ghost" color="gray">
                    <template #leading>
                        <UAvatar :src="user?.photoURL" size="xs"/>
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
    <UModal v-model="isAddAccountModalOpen">
        <UCard>
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-user-plus"/>
                        <h1 class="text-lg font-medium">Add Account</h1>
                    </div>
                    <UButton @click="isAddAccountModalOpen = false" icon="i-heroicons-x-mark" variant="ghost" color="gray"/>
                </div>
            </template>
            <UForm @submit="onSubmit" :schema="schema" :state="state" class="space-y-4">
                <UFormGroup label="Title" name="title" required>
                    <UInput v-model="state.title" type="text"/>
                </UFormGroup>
                <UDivider/>
                <UButton type="submit" label="Add" icon="i-heroicons-plus"/>
            </UForm>
        </UCard>
    </UModal>
    <UModal v-model="isManageAccountsModalOpen">
        <UCard>
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-users"/>
                        <h1 class="text-lg font-medium">Manage Accounts</h1>
                    </div>
                    <UButton @click="isManageAccountsModalOpen = false" icon="i-heroicons-x-mark" variant="ghost" color="gray"/>
                </div>
            </template>
            <UForm @submit="" class="space-y-4">
                <div v-for="account in accounts" class="flex gap-2">
                    <UInput v-model="account.title" class="w-full" type="text"/>
                    <UButton icon="i-heroicons-trash" color="red"/>
                </div>
                <UDivider/>
                <UButton type="submit" label="Save" icon="i-heroicons-check"/>
            </UForm>
        </UCard>
    </UModal>
</template>

<script lang="ts" setup>
    import { object, string } from "yup";
    import { signOut } from "firebase/auth";

    const isAddAccountModalOpen = ref<boolean>(false);
    const isManageAccountsModalOpen = ref<boolean>(false);

    const auth = useFirebaseAuth()!;
    const user = useCurrentUser();
    const accounts = useAccounts();
    const selectedAccountId = useSelectedAccountId();

    const schema = object({ title: string().required("Title is required") });

    const initialState: any = { title: undefined };
    
    const state = reactive<any>({ ...initialState });

    const tradingAccountsItems = computed<any>(() => [
        [
            ...accounts.value.map(account => ({
                label: account.title,
                slot: selectedAccountId.value === accounts.value.indexOf(account) ? "active" : null,
                click: () => selectedAccountId.value = accounts.value.indexOf(account),
            })),
        ],
        [
            {
                label:"Add Account",
                icon:"i-heroicons-plus-circle",
                iconClass: "order-1 ml-auto",
                click: () => openAddAccountModal(),
            },
            {
                label:"Manage Accounts",
                icon:"i-heroicons-cog-6-tooth",
                iconClass: "order-1 ml-auto",
                click: () => openManageAccountsModal(),
            },
        ],
    ]);

    const navLinks = [
        { label: "Dashboard", icon: "i-heroicons-squares-2x2", active: true },
        { label: "Analytics", icon: "i-heroicons-chart-bar" },
    ];

    const userItems = [
        [{ label: user.value?.email, slot: "account", disabled: true }],
        [{
            label:"Sign out",
            icon:"i-heroicons-arrow-right-on-rectangle",
            iconClass: "order-1 ml-auto",
            click: () => signOut(auth),
        }],
    ];

    function openAddAccountModal() {
        Object.assign(state, { ...initialState });
        isAddAccountModalOpen.value = true;
    }

    function openManageAccountsModal() {
        isManageAccountsModalOpen.value = true;
    }

    async function onSubmit() {
        accounts.value.push({
            title: state.title,
            trades: [],
        });

        isAddAccountModalOpen.value = false;
        selectedAccountId.value = accounts.value.length - 1;
    }
</script>