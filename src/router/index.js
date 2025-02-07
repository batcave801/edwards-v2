import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from "virtual:generated-layouts";
import Pages from "~pages";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...setupLayouts(Pages)]
})

export default router
