import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import { Auth } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";

// Definicion de rutas
const routes = [
    // Home
    { 
        path: '/', 
        name: 'Home',
        component: () => import('../views/Home.vue'),
        props: true,
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginPage.vue'),
        props: true,
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/project/:projectId',
        name: 'project',
        component: () => import('../views/Project.vue'),
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/project/backlog/:projectId',
        name: 'backlog',
        component: () => import('../views/Backlog.vue'),
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/project/config/:projectId',
        name: 'backlog',
        component: () => import('../views/ConfigPj.vue'),
        props: true,
        meta: { requiresAuth: true }
    },
    // Rutas no encontradas
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue'),
    }
]

// Crea el enrutador
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    },
});

// validar el inicio de sesión
router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        onAuthStateChanged(Auth, (user) => {
          if (user) {
            next(); // Usuario autenticado, permitir acceso
          } else {
            next("/login"); // Redirigir a login si no está autenticado
          }
        });
      } else {
        next(); // Rutas públicas
      }
});

export default router;
