import { createRouter, createWebHashHistory } from "vue-router";
import MainContent from "@/components/MainContent/MainContent.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: MainContent,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
