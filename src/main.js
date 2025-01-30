import { createApp } from "vue";
import router from "./router";
import { createPinia } from "pinia";
import piniaPersistedState from "pinia-plugin-persistedstate";
import App from "./App.vue";

import "../src/styles/index.css";
import "bootstrap/dist/css/bootstrap.min.css";

const pinia = createPinia();
pinia.use(piniaPersistedState);

const app = createApp(App);
app.use(router);
app.use(pinia);

app.mount("#app");
