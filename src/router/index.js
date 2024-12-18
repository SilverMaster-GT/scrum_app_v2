import { createRouter, createWebHistory } from 'vue-router';

// Definicion de rutas
const routes = [
    // Home
    { 
        path: '/', 
        name: 'Home',
        component: () => import('../views/Home.vue'),
        props: true,
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

export default router;
