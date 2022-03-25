import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import MainLayout from '@/components/layouts/MainLayout.vue';
import AuthLayout from '@/components/layouts/AuthLayout.vue';
import Home from '@/components/views/Home.vue';
import About from '@/components/views/About.vue';
import Login from '@/components/views/auth/Login.vue';
import Reports from '@/components/views/Reports.vue';
import SignUp from '@/components/views/auth/SignUp.vue';
import NotFound from '@/components/views/NotFound.vue';
import authGuard from '@/router/authGuard';
import Confirm from '@/components/views/auth/Confirm.vue';
import RestorePassword from '@/components/views/auth/RestorePassword.vue';
import ForgotPassword from '@/components/views/auth/ForgotPassword.vue';
import Offers from '@/components/views/Offers.vue';
import OfferUpdate from '@/components/views/OfferUpdate.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/auth',
    name: 'Auth',
    component: AuthLayout,
    meta: {
      guest: true,
    },
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login,
      },
      {
        path: 'signup',
        name: 'SignUp',
        component: SignUp,
      },
      {
        path: 'confirm/:token',
        name: 'Confirm',
        component: Confirm,
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
      },
      {
        path: 'restore/:token',
        name: 'Restore',
        component: RestorePassword,
      },
    ],
  },
  {
    path: '',
    name: '',
    component: MainLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home,
      },
      {
        path: '/reports',
        name: 'Reports',
        component: Reports,
      },
      {
        path: '/offers',
        name: 'Offers',
        component: Offers,
      },
      {
        path: '/offer/:id',
        name: 'OfferUpdate',
        component: OfferUpdate,
      },
      {
        path: '/about',
        name: 'About',
        component: About,
      },
    ],
  },
  {
    path: '*',
    name: '404',
    alias: '/404',
    component: NotFound,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(authGuard);

export default router;
