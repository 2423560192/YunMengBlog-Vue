<template>
  <Home>
    <div class="about-container">
      <div class="about-header">
        <h1 class="about-title">关于我</h1>
        <div class="about-subtitle">分享技术，记录生活</div>
      </div>

      <div class="about-content">
        <div class="about-section">
          <h2>个人简介</h2>
          <p>你好，我是云梦物语，一名热爱技术的全栈开发者。这个博客是我用来分享技术经验和生活感悟的地方。</p>
        </div>

        <div class="about-section">
          <h2>技术栈</h2>
          <div class="skills-container">
            <div class="skill-item" v-for="skill in skills" :key="skill.name">
              <i :class="skill.icon"></i>
              <span>{{ skill.name }}</span>
              <div class="skill-level" :style="{ width: skill.level + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="about-section">
          <h2>联系方式</h2>
          <div class="contact-info">
            <a href="https://github.com/yourusername" target="_blank" class="contact-item">
              <i class="fab fa-github"></i>
              <span>GitHub</span>
            </a>
            <a href="mailto:your.email@example.com" class="contact-item">
              <i class="fas fa-envelope"></i>
              <span>Email</span>
            </a>
            <a href="https://blog.csdn.net/yourusername" target="_blank" class="contact-item">
              <i class="fas fa-blog"></i>
              <span>CSDN</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </Home>
</template>

<script>
import Home from '@/components/Home.vue'

export default {
  name: 'About',
  components: {
    Home
  },
  data () {
    return {
      skills: [
        { name: 'Vue.js', icon: 'fab fa-vuejs', level: 90 },
        { name: 'JavaScript', icon: 'fab fa-js', level: 85 },
        { name: 'Python', icon: 'fab fa-python', level: 80 },
        { name: 'Node.js', icon: 'fab fa-node-js', level: 75 },
        { name: 'HTML5', icon: 'fab fa-html5', level: 95 },
        { name: 'CSS3', icon: 'fab fa-css3-alt', level: 85 }
      ]
    }
  }
}
</script>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.about-header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.about-title {
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 0.5rem;
}

.about-subtitle {
  font-size: 1.2rem;
  opacity: 0.8;
}

.about-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.about-section {
  margin-bottom: 2.5rem;
}

.about-section h2 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
}

.about-section p {
  color: #34495e;
  line-height: 1.6;
}

.skills-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.skill-item {
  position: relative;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  overflow: hidden;
}

.skill-item i {
  font-size: 1.5rem;
  color: #3273dc;
  z-index: 1;
}

.skill-item span {
  color: #2c3e50;
  font-weight: 500;
  z-index: 1;
}

.skill-level {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(50, 115, 220, 0.1);
  transition: width 1s ease-out;
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3273dc;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.contact-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.contact-item i {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .about-container {
    padding: 1rem;
  }

  .about-title {
    font-size: 2rem;
  }

  .about-content {
    padding: 1.5rem;
  }

  .skills-container {
    grid-template-columns: 1fr;
  }

  .contact-info {
    flex-direction: column;
  }

  .contact-item {
    width: 100%;
    justify-content: center;
  }
}
</style>
