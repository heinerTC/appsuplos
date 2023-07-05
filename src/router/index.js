import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/LoginForm.vue';
import Registro from '../components/RegistroForm.vue';
import Crear from '../components/CrearForm.vue';
import Documentos from '../components/DocumentosForm.vue';
import Consultar from '../components/ConsultarForm.vue';
import store from '../store';

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        mostrarHeaderFooter: false
      }
    },
    {
      path: '/registro',
      name: 'Registro',
      component: Registro,
      meta: {
        mostrarHeaderFooter: false
      }
    },
    {
      path: '/crear',
      name: 'Crear',
      component: Crear,
      meta: {
        mostrarHeaderFooter: true,
        requiresAuth: true
      }
    },
    {
      path: '/documentos',
      name: 'Documentos',
      component: Documentos,
      meta: {
        mostrarHeaderFooter: true,
        requiresAuth: true
      }
    },
    {
      path: '/consultar',
      name: 'Consultar',
      component: Consultar,
      meta: {
        mostrarHeaderFooter: true,
        requiresAuth: true
      }
    },
  ]
});

router.beforeEach((to, from, next) => {
  const mostrarHeaderFooter = to.meta && to.meta.mostrarHeaderFooter !== false;
  if (mostrarHeaderFooter) {
    store.dispatch('mostrarHeaderFooter');
  } else {
    store.dispatch('ocultarHeaderFooter');
  }
  const requiresAuth = to.meta.requiresAuth;
  const isAuthenticated = store.state.authenticated;

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;
