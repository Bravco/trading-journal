// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/image", "nuxt-lodash", "nuxt-echarts"],
  css: ["~/assets/main.css"],
  colorMode: {
    preference: "dark",
  },
  echarts: {
    charts: ["LineChart"],
    components: ["GridComponent"],
  },
  compatibilityDate: "2024-07-05",
})