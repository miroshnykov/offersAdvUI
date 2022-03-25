import { Route, NavigationGuardNext, RouteRecord } from 'vue-router';
import Vue from 'vue';

export default (to: Route, from: Route, next: NavigationGuardNext<Vue>) => {
  if (to.matched.some((record: RouteRecord) => record.meta.requiresAuth)) {
    if (localStorage.getItem('accessToken') == null) {
      next({
        path: '/auth/login',
        params: { nextUrl: to.fullPath },
      });
    } else {
      next();
    }
  } else if (to.matched.some((record: RouteRecord) => record.meta.guest)) {
    if (localStorage.getItem('accessToken') == null) {
      next();
    } else {
      next({ name: 'Home' });
    }
  } else {
    next();
  }
};
