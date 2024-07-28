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
            <UForm @submit="onAddAccountSubmit" :schema="addAccountSchema" :state="addAccountState" class="space-y-4">
                <UFormGroup label="Title" name="title" required>
                    <UInput v-model="addAccountState.title" type="text"/>
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
            <div class="space-y-4">
                <div v-for="account in manageAccountState" class="flex gap-2">
                    <UInput v-model="account.title" class="w-full" type="text"/>
                    <UButton 
                        @click="() => account.delete = !account.delete" 
                        :icon="account.delete ? 'i-heroicons-check' : 'i-heroicons-trash'" 
                        color="red"
                    />
                </div>
                <UDivider/>
                <div class="flex items-center justify-between">
                    <UButton @click="onManageAccountsSubmit" label="Save" icon="i-heroicons-check"/>
                    <UButton @click="isManageAccountsModalOpen = false" label="Cancel" icon="i-heroicons-x-mark" variant="ghost" color="gray"/>
                </div>
            </div>
        </UCard>
    </UModal>
</template>

<script lang="ts" setup>
    import { object, string } from "yup";
    import { signOut } from "firebase/auth";
    import { collection, addDoc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";

    const isAddAccountModalOpen = useIsAddAccountModalOpen();
    const isManageAccountsModalOpen = ref<boolean>(false);

    const router = useRouter();
    const auth = useFirebaseAuth()!;
    const user = useCurrentUser();    
    const firestore = useFirestore();
    const accountsRef = collection(firestore, `users/${user.value!.uid}/accounts`);
    const accounts = useCollection(accountsRef);
    const selectedAccountId = useSelectedAccountId();

    const addAccountSchema = object({ title: string().required("Title is required") });

    const addAccountInitialState: any = { title: undefined };
    
    const addAccountState = reactive<any>({ ...addAccountInitialState });
    const manageAccountState = ref<any>([]);

    const tradingAccountsItems = computed<any>(() => [
        [
            ...accounts.value.map(account => ({
                label: account.title,
                slot: selectedAccountId.value === account.id ? "active" : null,
                click: () => selectedAccountId.value = account.id,
            })),
        ],
        [
            {
                label:"Add Account",
                icon:"i-heroicons-plus-circle",
                iconClass: "order-1 ml-auto",
                click: () => isAddAccountModalOpen.value = true,
            },
            {
                label:"Manage Accounts",
                icon:"i-heroicons-cog-6-tooth",
                iconClass: "order-1 ml-auto",
                click: () => openManageAccountsModal(),
            },
        ],
    ]);

    const navLinks = computed(() => [
        { 
            label: "Dashboard", 
            icon: "i-heroicons-squares-2x2", 
            active: router.currentRoute.value.path === "/",
            click: () => navigateTo("/"),
        },
        { 
            label: "Analytics", 
            icon: "i-heroicons-chart-bar",
            active: router.currentRoute.value.path === "/analytics",
            click: () => navigateTo("/analytics"),
        },
    ]);

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
        Object.assign(addAccountState, { ...addAccountInitialState });
        isAddAccountModalOpen.value = true;
    }

    function openManageAccountsModal() {
        manageAccountState.value = [
            ...accounts.value.map(account => ({
                id: account.id,
                title: account.title,
                delete: false,
            })),
        ];
        isManageAccountsModalOpen.value = true;
    }

    async function onAddAccountSubmit() {
        addDoc(accountsRef, {
            title: addAccountState.title,
        }).then(docRef => {
            updateDoc(docRef, {
                id: docRef.id,
            });

            selectedAccountId.value = docRef.id;
        });
        
        isAddAccountModalOpen.value = false;
    }

    async function onManageAccountsSubmit() {
        manageAccountState.value.map((account: any) => {
            getDoc(selectedAccountRef.value).then(snapshot => {
                if (account.delete === true) {
                    deleteDoc(snapshot.ref);
                    selectedAccountId.value = null;
                } else {
                    updateDoc(snapshot.ref, {
                        title: account.title,
                    });
                }
            });
        });

        isManageAccountsModalOpen.value = false;
    }

    watch(isAddAccountModalOpen, () => {
        if (isAddAccountModalOpen.value === true) {
            openAddAccountModal();
        }
    });
</script>