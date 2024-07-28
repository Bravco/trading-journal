<template>
    <NuxtLayout>
        <NuxtPage/>
    </NuxtLayout>
    <UNotifications/>
</template>

<script lang="ts" setup>
    import { onAuthStateChanged } from 'firebase/auth';
    import { collection, getDoc, getDocs, query, onSnapshot } from 'firebase/firestore';

    const auth = useFirebaseAuth()!;
    const firestore = useFirestore();
    const selectedAccountId = useSelectedAccountId();
    const selectedAccount = useSelectedAccount();
    const trades = useTrades();

    watch(selectedAccountId, async () => {
        if (selectedAccountId.value) {
            selectedAccount.value = (await getDoc(selectedAccountRef.value)).data();
            onSnapshot(tradesRef.value, snapshot => trades.value = [...snapshot.docs.map(doc => doc.data())] as Trade[]);
        } else {
            selectedAccount.value = null;
            trades.value = [];
        }
    });

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