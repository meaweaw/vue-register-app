import { createRouter, createWebHistory } from "vue-router";
import LoginComponent from "@/components/LoginComponent.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginComponent,
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/components/RegisterComponent.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("@/components/ProfileComponent.vue"),
    },
  ],
});

export default router;
