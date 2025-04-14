<template>
  <nav class="desktop-nav">
    <div class="nav-container">
      <div class="nav-brand">
        <router-link to="/">云梦博客</router-link>
      </div>
      <div class="nav-menu">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
        >
          <i :class="item.icon"></i>
          {{ item.title }}
        </router-link>
        <router-link to="/write" class="nav-item" v-if="isLoggedIn">
          <i class="fas fa-pen-fancy"></i>
          <span>写文章</span>
        </router-link>
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="nav-item">
            <i class="fas fa-sign-in-alt"></i>
            <span>登录</span>
          </router-link>
          <router-link to="/register" class="nav-item">
            <i class="fas fa-user-plus"></i>
            <span>注册</span>
          </router-link>
        </template>
        <template v-else>
          <div class="user-info">
            <img :src="userInfo && userInfo.avatar ? userInfo.avatar : require('@/assets/images/default-avatar.png')" class="user-avatar" />
            <span class="username">{{ userInfo ? userInfo.username : '' }}</span>
          </div>
          <a href="#" class="nav-item" @click.prevent="handleLogout">
            <i class="fas fa-sign-out-alt"></i>
            <span>退出</span>
          </a>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'DesktopNav',
  data () {
    return {
      menuItems: [
        { path: '/', title: '首页', icon: 'fas fa-home' },
        { path: '/about', title: '关于', icon: 'fas fa-info-circle' },
        { path: '/posts', title: '文章', icon: 'fas fa-file-alt' },
        { path: '/categories', title: '分类', icon: 'fas fa-folder' },
        { path: '/tags', title: '标签', icon: 'fas fa-tags' }
      ]
    }
  },
  computed: {
    ...mapState('auth', ['isLoggedIn', 'userInfo'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    async handleLogout () {
      await this.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.desktop-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: 600;
}

.nav-brand a {
  color: #34495e;
  text-decoration: none;
  background: linear-gradient(135deg, #74ebd5 0%, #acb6e5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-menu {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-item {
  color: #34495e;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 20px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-item i {
  color: #74ebd5;
}

.nav-item:hover {
  background: rgba(116, 235, 213, 0.1);
  color: #74ebd5;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 15px;
  background: rgba(116, 235, 213, 0.1);
  border-radius: 20px;
  margin-right: 10px;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  color: #34495e;
  font-weight: 500;
}
</style>
