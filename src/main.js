import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import moment from "moment";
import store from "./store";
import router from "./router";
import Equal from "equal-vue";
import "equal-vue/dist/style.css";
import "bootstrap/dist/css/bootstrap.min.css";

axios.defaults.baseURL = "http://localhost:4000/api/";
axios.defaults.headers.common["authorization"] = `JWT ${store.state.accessToken}`;

let app = createApp(App);
app.config.globalProperties.$axios = axios;
app.config.globalProperties.moment = moment;
app.use(store).use(router).use(Equal).mount("#app");
