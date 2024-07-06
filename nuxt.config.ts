// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/image"],
  colorMode: {
    preference: "dark",
  },
  ui: {
    icons: ["ph"],
  },
  compatibilityDate: "2024-07-05",
})