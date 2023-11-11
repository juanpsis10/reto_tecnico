// main.js
import { createApp } from "vue";
import App from "./App.vue";
import store from "./store"; // Asegúrate de importar tu store Vuex

const app = createApp(App);
app.use(store); // Instala Vuex en tu aplicación
app.mount("#app");
