import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeContent from '../components/HomeContent.vue'
import Posts from '../components/Posts.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import PostDetail from '../components/PostDetail.vue'
import CategoryPosts from '../components/CategoryPosts.vue'
import MessageBoard from '../components/MessageBoard.vue'
import WritePost from '../components/WritePost.vue'

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
    path: '/register',
    name: 'Register',
    component: Register
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
  },
  {
    path: '/messages',
    name: 'MessageBoard',
    component: MessageBoard
  },
  {
    path: '/write',
    name: 'WritePost',
    component: WritePost,
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { x: 0, y: 0 }
  }
})

export default router
