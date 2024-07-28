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
        } else {
            selectedAccount.value = null;
        }
    });

    onMounted(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                getDocs(query(collection(firestore, `users/${user.uid}/accounts`))).then(snapshot => {
                    if (snapshot.docs.length > 0) {
                        const tradesRef = collection(firestore, `users/${user.uid}/accounts/${snapshot.docs[0].id}/trades`);
                        selectedAccountId.value = snapshot.docs[0].id;
                        onSnapshot(tradesRef, snapshot => trades.value = [...snapshot.docs.map(doc => doc.data())] as Trade[]);
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