<template>
    <UModal v-model="isFieldModalOpen">
        <UCard>
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-cog-6-tooth"/>
                        <h1 class="text-lg font-medium">Manage Fields</h1>
                    </div>
                    <UButton @click="isFieldModalOpen = false" icon="i-heroicons-x-mark" variant="ghost" color="gray"/>
                </div>
            </template>
            <div class="grid gap-4" style="grid-template-columns: 1fr 1px 2fr;">
                <UForm @submit="onSubmit" :schema="schema" :state="state" class="space-y-4">
                    <div class="flex items-center justify-between gap-2">
                        <h2 class="text-md font-medium">
                            {{ editMode ? 
                                (editedCustomFieldId === null ? 'Pick Field' : 'Edit Field') 
                                : 'New Field' }}
                        </h2>
                        <UButton 
                            @click="toggleEditMode" 
                            icon="i-heroicons-pencil-square" 
                            variant="ghost" 
                            :color="editMode ? 'primary' : 'gray'"
                        />
                    </div>
                    <UFormGroup label="Label" name="label" required>
                        <UInput v-model="state.label" type="text" :disabled="editMode && editedCustomFieldId === null"/>
                    </UFormGroup>
                    <UFormGroup label="Type" name="type" required>
                        <USelectMenu
                            v-model="state.type"
                            value-attribute="value"
                            option-attribute="label"
                            :options="typeOptions"
                            :disabled="editMode"
                        />
                    </UFormGroup>
                    <UButton 
                        type="submit" 
                        :label="editMode ? 'Save' : 'Add'" 
                        :icon="editMode ? 'i-heroicons-check' : 'i-heroicons-plus'" 
                        :disabled="editMode && editedCustomFieldId === null"
                    />
                </UForm>
                <UDivider orientation="vertical"/>
                <div v-if="editMode" class="flex flex-col gap-2">
                    <h2 class="text-md font-medium">Custom</h2>
                    <ul v-if="customFields.length > 0" class="flex flex-wrap gap-2">
                        <li v-for="customField in customFields">
                            <UBadge
                                @click="selectEditedFieldId(customField.id)"
                                :color="editedCustomFieldId === customField.id ? 'primary' : 'gray'"
                                :label="customField.label"
                                variant="solid"
                                class="cursor-pointer"
                            />
                        </li>
                    </ul>
                    <span v-else class="text-sm font-medium text-gray-500 dark:text-gray-400">You have no custom fields</span>
                </div>
                <div v-else class="flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                        <h2 class="text-md font-medium">Default</h2>
                        <UTooltip text="Note that analytics are calculated with default fields">
                            <UIcon name="i-heroicons-information-circle"/>
                        </UTooltip>
                    </div>
                    <ul class="flex flex-wrap gap-2">
                        <li><UBadge label="Open Date" color="gray" variant="solid"/></li>
                        <li><UBadge label="Symbol" color="gray" variant="solid"/></li>
                        <li><UBadge label="Risk Reward" color="gray" variant="solid"/></li>
                        <li><UBadge label="Original Risk" color="gray" variant="solid"/></li>
                        <li><UBadge label="Net P&L" color="gray" variant="solid"/></li>
                        <li><UBadge label="Image Url" color="gray" variant="solid"/></li>
                        <li><UBadge label="Strategy" color="gray" variant="solid"/></li>
                        <li><UBadge label="Note" color="gray" variant="solid"/></li>
                        <li><UBadge label="Tags" color="gray" variant="solid"/></li>
                    </ul>
                    <UDivider/>
                    <h2 class="text-md font-medium">Custom</h2>
                    <ul v-if="customFields.length > 0" class="flex flex-wrap gap-2">
                        <li v-for="customField in customFields">
                            <UBadge :label="customField.label" color="gray" variant="solid"/>
                        </li>
                    </ul>
                    <span v-else class="text-sm font-medium text-gray-500 dark:text-gray-400">You have no custom fields</span>
                </div>
            </div>
        </UCard>
    </UModal>
</template>

<script lang="ts" setup>
    import { object, string } from "yup";
    import { addDoc, updateDoc, getDoc, doc } from "firebase/firestore";

    const firestore = useFirestore();
    const customFields = useCustomFields();
    const isFieldModalOpen = useIsFieldModalOpen();

    const editMode = ref<boolean>(false);
    const editedCustomFieldId = ref<string | null>(null);

    const initialState: any = { label: undefined, type: undefined };
    
    const state = reactive<any>({ ...initialState });

    const typeOptions = [
        { label: "Text", value: "text" },
        { label: "Number", value: "number" },
    ];

    const schema = object({
        label: string().required("Label is required"),
        type: string().required("Type is required"),
    });

    function resetForm() {
        editedCustomFieldId.value = null;
        Object.assign(state, { ...initialState });
    }

    function toggleEditMode() {
        editMode.value = !editMode.value;
        resetForm();
    }

    function selectEditedFieldId(id: string) {
        if (editedCustomFieldId.value === id) {
            editedCustomFieldId.value = null;
            Object.assign(state, { ...initialState });
        } else {
            editedCustomFieldId.value = id;
            getDoc(doc(firestore, `${customFieldsRef.value.path}/${id}`)).then(snapshot => {
                const customField: CustomField = snapshot.data() as CustomField;
                Object.assign(state, {
                    label: customField.label,
                    type: customField.type,
                });
            });
        }
    }

    async function onSubmit() {
        const newCustomField: Omit<CustomField, "id"> = {
            label: state.label,
            type: state.type,
        };

        if (editMode && editedCustomFieldId.value !== null) {
            updateDoc(doc(firestore, `${customFieldsRef.value.path}/${editedCustomFieldId.value}`), newCustomField);
        } else {
            addDoc(customFieldsRef.value, newCustomField).then(customFieldRef => {
                updateDoc(customFieldRef, { id: customFieldRef.id });
            });
        }

        resetForm();
    }
</script>