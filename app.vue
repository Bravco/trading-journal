<template>
    <NuxtLayout>
        <NuxtPage/>
    </NuxtLayout>
    <UNotifications/>
</template>

<script lang="ts" setup>
    import { onAuthStateChanged } from 'firebase/auth';
    import { collection, getDocs, query } from 'firebase/firestore';

    const auth = useFirebaseAuth()!;
    const firestore = useFirestore();
    const selectedAccountId = useSelectedAccountId();

    onMounted(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                getDocs(query(collection(firestore, `users/${user.uid}/accounts`))).then(snapshot => {
                    if (snapshot.docs.length > 0) {
                        selectedAccountId.value = snapshot.docs[0].id;
                    }
                });
                
                navigateTo("/");
            } else {
                selectedAccountId.value = null;
                navigateTo("/auth");
            }
        });
    });
</script>