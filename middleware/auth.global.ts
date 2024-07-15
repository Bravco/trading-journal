export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = await getCurrentUser();

    if (!user && to.path !== "/auth") {
        return navigateTo({ path: "/auth" });
    }
});