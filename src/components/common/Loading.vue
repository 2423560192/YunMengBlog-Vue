<template>
  <div class="loading-container" :class="{ overlay: overlay }">
    <div class="spinner">
      <i class="fas fa-spinner fa-spin" :style="{ fontSize: `${size}rem` }"></i>
    </div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    text: String,
    size: {
      type: Number,
      default: 2
    },
    overlay: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.loading-container.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  z-index: 100;
}

.spinner {
  margin-bottom: 0.5rem;
  color: #3498db;
}

.loading-text {
  color: #666;
  margin: 0;
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .loading-container.overlay {
    background: rgba(26, 32, 44, 0.8);
  }

  .spinner {
    color: #4299e1;
  }

  .loading-text {
    color: #a0aec0;
  }
}
</style>
