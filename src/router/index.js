import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeContent from '../components/HomeContent.vue'
import Posts from '../components/Posts.vue'
import Login from '../components/Login.vue'
import PostDetail from '../components/PostDetail.vue'
import CategoryPosts from '../components/CategoryPosts.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeContent
  },
  {
    path: '/posts',
    name: 'Posts',
    component: Posts
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/posts/:id',
    name: 'PostDetail',
    component: PostDetail
  },
  {
    path: '/category/:category',
    name: 'CategoryPosts',
    component: CategoryPosts
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
