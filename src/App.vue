<template>
  <div id="app">
    <div id="particles-js"></div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    // 加载 particles.js
    const particlesScript = document.createElement('script')
    particlesScript.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js'
    particlesScript.onload = () => {
      window.particlesJS('particles-js', {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: '#ffffff'
          },
          shape: {
            type: 'circle'
          },
          opacity: {
            value: 0.5,
            random: false
          },
          size: {
            value: 3,
            random: true
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.5,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
          }
        }
      })
    }
    document.head.appendChild(particlesScript)
  }
}
</script>

<style>
body {
  font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  color: #34495e;
  background: linear-gradient(135deg, #74ebd5 0%, #acb6e5 100%);
  -webkit-font-smoothing: antialiased;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

#particles-js {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.card {
  border: none;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>
