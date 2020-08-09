import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'  // HV mag weg later als ik HelloWorld wegwil
import Timesheet from '../views/Timesheet.vue'

Vue.use(VueRouter);

  const routes = [
  {
    path: '/',
    name: 'Timesheet',
    component: Timesheet
  },
  {
    path: '/timesheet',
    name: 'Timesheet2',
    component: Timesheet
  },
  {
    path: '/timesheet/:entryId',
    name: 'TimesheetEdit',
    component: Timesheet,
    props: true
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
