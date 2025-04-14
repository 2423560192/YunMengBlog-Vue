<template>
  <div class="mobile-nav">
    <div class="nav-header">
      <div class="nav-brand">
        <router-link to="/">云梦博客</router-link>
      </div>
      <button class="menu-toggle" @click="isOpen = !isOpen">
        <i :class="isOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
      </button>
    </div>
    <div class="nav-menu" :class="{ 'is-open': isOpen }">
      <div class="user-info" v-if="isLoggedIn">
        <img :src="userInfo && userInfo.avatar ? userInfo.avatar : require('@/assets/images/default-avatar.png')" class="user-avatar" />
        <span class="username">{{ userInfo ? userInfo.username : '' }}</span>
      </div>
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        @click="isOpen = false"
      >
        <i :class="item.icon"></i>
        {{ item.title }}
      </router-link>
      <router-link to="/write" class="nav-item" v-if="isLoggedIn" @click="isOpen = false">
        <i class="fas fa-pen-fancy"></i>
        <span>写文章</span>
      </router-link>
      <template v-if="!isLoggedIn">
        <router-link to="/login" class="nav-item" @click="isOpen = false">
          <i class="fas fa-sign-in-alt"></i>
          <span>登录</span>
        </router-link>
        <router-link to="/register" class="nav-item" @click="isOpen = false">
          <i class="fas fa-user-plus"></i>
          <span>注册</span>
        </router-link>
      </template>
      <a href="#" class="nav-item" v-if="isLoggedIn" @click.prevent="handleLogout">
        <i class="fas fa-sign-out-alt"></i>
        <span>退出</span>
      </a>
    </div>

    <!-- 遮罩层 -->
    <div class="overlay" v-if="isOpen" @click="isOpen = false" :class="{ 'overlay-show': isOpen }"></div>

    <!-- 添加移动端时间和天气显示 -->
    <div class="mobile-time-weather">
      <span class="mobile-time">{{ currentTime }}</span>
      <div class="mobile-weather">
        <i class="fas fa-sun"></i>
        <span>{{ weather }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'MobileNav',
  data () {
    return {
      isOpen: false,
      menuItems: [
        { path: '/', title: '首页', icon: 'fas fa-home' },
        { path: '/about', title: '关于', icon: 'fas fa-info-circle' },
        { path: '/posts', title: '文章', icon: 'fas fa-file-alt' },
        { path: '/categories', title: '分类', icon: 'fas fa-folder' },
        { path: '/tags', title: '标签', icon: 'fas fa-tags' }
      ],
      currentTime: '',
      weather: ''
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
    },
    updateTime () {
      setInterval(() => {
        this.currentTime = new Date().toLocaleTimeString()
      }, 1000)
    }
  },
  created () {
    this.updateTime()
  }
}
</script>

<style scoped>
.mobile-nav {
  display: none;
}

@media (max-width: 768px) {
  .mobile-nav {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
  }

  .nav-header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .nav-menu {
    position: fixed;
    top: 60px;
    left: -100%;
    width: 100%;
    height: calc(100vh - 60px);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    transition: left 0.3s ease;
    padding: 20px;
    overflow-y: auto;
  }

  .nav-menu.is-open {
    left: 0;
  }

  .menu-toggle {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #34495e;
    cursor: pointer;
    padding: 5px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    padding: 15px;
    color: #34495e;
    text-decoration: none;
    border-radius: 8px;
    margin: 5px 0;
    transition: all 0.3s ease;
  }

  .nav-item i {
    margin-right: 10px;
    color: #74ebd5;
  }

  .nav-item:hover {
    background: rgba(116, 235, 213, 0.1);
    color: #74ebd5;
  }

  .user-info {
    display: flex;
    align-items: center;
    padding: 15px;
    margin-bottom: 20px;
    background: rgba(116, 235, 213, 0.1);
    border-radius: 8px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
  }

  .username {
    color: #34495e;
    font-weight: 500;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .overlay-show {
    opacity: 1;
    visibility: visible;
  }

  .mobile-time-weather {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 10px 15px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .mobile-time {
    color: #34495e;
    font-weight: 500;
  }

  .mobile-weather {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #34495e;
  }

  .mobile-weather i {
    color: #f1c40f;
  }
}
</style>
