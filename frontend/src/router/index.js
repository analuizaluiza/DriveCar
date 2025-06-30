import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Start from "../views/HomeView.vue";
import Home from "../components/Home.vue";
import Profile from "../components/Profile.vue";
import CarDetail from "@/components/carDetail.vue";
import BookingView from "@/views/BookingView.vue";

const routes = [
  { path: "/profile", component: Profile, meta: { requiresAuth: true } },
  { path: "/home", component: Home, meta: { requiresAuth: true } },
  { path: "/", component: Start },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/:pathMatch(.*)*", redirect: "/login" },
  { path: "/car/:id", component: CarDetail, name: "carDetail" },
  {
    path: "/api/bookings/:id",
    component: BookingView,
    name: "bookingView",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function isTokenValid() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (e) {
    return false;
  }
}

router.beforeEach((to, from, next) => {
  const isAuthenticated = isTokenValid();

  if ((to.path === "/login" || to.path === "/register") && isAuthenticated) {
    return next("/home");
  }

  // Protege rotas que exigem autenticação
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      return next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    }
  }

  next();
});

export default router;
