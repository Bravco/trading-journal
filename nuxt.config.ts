// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/image", "nuxt-lodash"],
  css: ["~/assets/main.css"],
  colorMode: {
    preference: "dark",
  },
  compatibilityDate: "2024-07-05",
})