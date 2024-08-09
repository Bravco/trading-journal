<template>
    <div class="h-svh flex justify-center items-center">
        <UCard class="w-full sm:w-max sm:min-w-96 m-4">
            <template #header>
                <h1 class="text-xl font-medium">{{ signingUp ? "Sign up" : "Sign in" }}</h1>
            </template>
            <UForm v-if="signingUp" @submit="signUp" :schema="signUpSchema" :state="signUpState" class="space-y-4">
                <UFormGroup label="Email" name="email" required>
                    <UInput v-model="signUpState.email" type="email"/>
                </UFormGroup>
                <UFormGroup label="Password" name="password" required>
                    <UInput v-model="signUpState.password" type="password"/>
                </UFormGroup>
                <UFormGroup label="Confirm Password" name="confirmPassword" required>
                    <UInput v-model="signUpState.confirmPassword" type="password"/>
                </UFormGroup>
                <UButton type="submit" :label="loading ? null : 'Sign up'" :icon="loading ? 'i-eos-icons-loading' : null" block/>
                <UButton @click="toggleSigningUp" label="Already have an account?" variant="link" color="gray" :padded="false" block/>
            </UForm>
            <UForm v-else @submit="signIn" :schema="signInSchema" :state="signInState" class="space-y-4">
                <UFormGroup label="Email" name="email" required>
                    <UInput v-model="signInState.email" type="email"/>
                </UFormGroup>
                <UFormGroup label="Password" name="password" required>
                    <UInput v-model="signInState.password" type="password"/>
                </UFormGroup>
                <UButton type="submit" :label="loading ? null : 'Sign in'" :icon="loading ? 'i-eos-icons-loading' : null" block/>
                <UButton @click="toggleSigningUp" label="Don't have an account?" variant="link" color="gray" :padded="false" block/>
            </UForm>
            <UDivider class="my-4" label="OR"/>
            <UButton @click="googleSignIn" label="Sign in with Google" icon="i-logos-google-icon" color="black" block/>
        </UCard>
    </div>
</template>

<script lang="ts" setup>
    import { object, string } from "yup";
    import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification, sendPasswordResetEmail, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
    import type { UserCredential } from "firebase/auth";
    import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

    const auth = useFirebaseAuth()!;
    const firestore = useFirestore();
    const toast = useToast();

    const googleAuthProvider = new GoogleAuthProvider();

    const signingUp = ref<boolean>(false);
    const loading = ref<boolean>(false);

    const signUpSchema = object({
        email: string().email().required("Email is required"),
        password: string().required("Password is required")
            .test("length", "Password should be at least 6 characters", value => value.length >= 6),
        confirmPassword: string().required("Repeat password")
            .test("passwords-match", "Passwords must match", function (value) {
                return this.parent.password === value;
            }),
    });

    const signInSchema = object({
        email: string().email().required("Email is required"),
        password: string().required("Password is required")
            .test("length", "Password should be at least 6 characters", value => value.length >= 6),
    });

    const signUpState = reactive<any>({
        email: undefined,
        password: undefined,
        confirmPassword: undefined,
    });

    const signInState = reactive<any>({
        email: undefined,
        password: undefined,
    });

    function toggleSigningUp() {
        if (!loading.value) {
            signingUp.value = !signingUp.value;
        }
    }

    async function signUp() {
        loading.value = true;
        
        createUserWithEmailAndPassword(auth, signUpState.email, signUpState.password).then(credential => {
            saveUserData(credential);
            sendEmailVerification(credential.user);
            toast.add({ title: "Verification email was sent to your email address", icon: "i-heroicons-information-circle", color: "green", });
            loading.value = false;
        }).catch(error => {
            let message = null;

            switch (error.code) {
                case "auth/email-already-in-use":
                    message = "The email address is already used";
                    break;
            
                default:
                    message = "Something went wrong";
                    break;
            }

            toast.add({ title: message, icon: "i-heroicons-exclamation-triangle", color: "red" });
            loading.value = false;
       });
    }
    
    async function signIn() {
        loading.value = true;

        signInWithEmailAndPassword(auth, signInState.email, signInState.password).then(credential => {
            saveUserData(credential);
            loading.value = false;
        }).catch(error => {
            let message = null;

            switch (error.code) {
                case "auth/invalid-credential":
                    message = "Email or password is incorrect";
                    break;
                
                default:
                    message = "Something went wrong";
                    break;
            }

            toast.add({ title: message, icon: "i-heroicons-exclamation-triangle", color: "red" });
            loading.value = false;
        });
    }

    async function googleSignIn() {
        loading.value = true;

        signInWithPopup(auth, googleAuthProvider).then(credential => {
            saveUserData(credential);
            loading.value = false;
        }).catch(() => {
            toast.add({ title: "Something went wrong", icon: "i-heroicons-exclamation-triangle", color: "red" });
            loading.value = false;
        });
    }

    function saveUserData(credential: UserCredential) {
        const userRef = doc(collection(firestore, "users"), credential.user.uid);

        getDoc(userRef).then(snapshot => {
            if (snapshot.exists()) {
                updateDoc(userRef, {
                    uid: credential.user.uid,
                    email: credential.user.email,
                });
            } else {
                setDoc(userRef, {
                    uid: credential.user.uid,
                    email: credential.user.email,
                });
            }
        }).catch(() => {
            toast.add({ title: "Something went wrong", icon: "i-heroicons-exclamation-triangle", color: "red" });
        });
    }
</script>