export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/image", "nuxt-lodash", "nuxt-echarts", "nuxt-vuefire"],
  css: ["~/assets/main.css"],
  colorMode: {
    preference: "dark",
  },
  ui: {
    icons: ["heroicons", "logos", "eos-icons"],
  },
  echarts: {
    charts: ["LineChart"],
    components: ["GridComponent"],
  },
  vuefire: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
    auth: {
      enabled: true,
    },
  },
  compatibilityDate: "2024-07-05",
})