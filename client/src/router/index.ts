import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Home = () => import(/* webpackChunkName: "homepage" */ '@/views/Home.vue');
const ListCreate = () => import(/* webpackChunkName: "create-list" */ '@/views/list/ListCreate.vue');
const ListEdit = () => import(/* webpackChunkName: "view-list" */ '@/views/list/ListEdit.vue');
const ListView = () => import(/* webpackChunkName: "edit-list" */ '@/views/list/ListView.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/create',
    name: 'ListCreate',
    component: ListCreate,
    meta: {
      title: 'Create list',
    },
  },
  {
    path: '/list/:id',
    name: 'ListView',
    component: ListView,
    meta: {
      title: 'List',
    },
  },
  {
    path: '/list-edit/:id',
    name: 'ListEdit',
    component: ListEdit,
    meta: {
      title: 'Edit list',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
