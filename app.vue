<template>
    <NuxtLayout>
        <NuxtPage/>
    </NuxtLayout>
    <UNotifications/>
</template>

<script lang="ts" setup>
    const user = useCurrentUser();

    onMounted(() => {
        watch(user, (user, prevUser) => {
            if (!prevUser && user) { // user signed it
                navigateTo("/");
            } else if (prevUser && !user) { // user signed out 
                navigateTo("/auth");
            }
        });
    });
</script>