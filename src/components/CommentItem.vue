<template>
  <div class="comment-item" :class="{ 'nested-comment': level > 0 }">
    <div class="comment-header">
      <img :src="getImageUrl(comment.user.avatar, 'avatar')"
           :alt="comment.user.username"
           class="comment-avatar">
      <div class="comment-info">
        <span class="comment-author">{{ comment.user.nickname || comment.user.username }}</span>
        <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
      </div>
    </div>
    <div class="comment-content">{{ comment.content }}</div>
    <div class="comment-actions">
      <button class="btn-reply" @click="handleReply" v-if="isLoggedIn">
        <i class="fas fa-reply"></i> 回复
      </button>
      <button class="btn-delete"
              v-if="isLoggedIn && comment.user.id === currentUserId"
              @click="handleDelete">
        <i class="fas fa-trash"></i>
      </button>
    </div>

    <!-- 递归渲染子评论 -->
    <div class="comment-replies" v-if="comment.children && comment.children.length > 0">
      <comment-item
        v-for="child in comment.children"
        :key="child.id"
        :comment="child"
        :current-user-id="currentUserId"
        :is-logged-in="isLoggedIn"
        :level="level + 1"
        @reply="$emit('reply', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script>
import { getImageUrl } from '../utils/request'

export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    },
    currentUserId: {
      type: Number,
      default: null
    },
    isLoggedIn: {
      type: Boolean,
      default: false
    },
    level: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      baseUrl: process.env.VUE_APP_API_URL || 'http://localhost:8000'
    }
  },
  methods: {
    getImageUrl,
    formatDate (date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    handleReply () {
      this.$emit('reply', this.comment)
    },
    handleDelete () {
      this.$emit('delete', this.comment.id)
    }
  }
}
</script>

<style scoped>
.comment-item {
  padding: 1rem;
  border-radius: 8px;
  background: #f8f9fa;
  border-left: 3px solid #3273dc;
  margin-bottom: 1rem;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.comment-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.comment-author {
  font-size: 0.9rem;
  font-weight: 500;
  color: #2c3e50;
}

.comment-date {
  font-size: 0.8rem;
  color: #666;
}

.comment-content {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #2c3e50;
  line-height: 1.5;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.comment-replies {
  margin-left: 2rem;
  padding-left: 1rem;
  border-left: 1px solid #e0e0e0;
}

.nested-comment {
  background: rgba(248, 249, 250, 0.5);
  border-left-color: #45b7d1;
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .comment-item {
    background: #1a202c;
  }

  .comment-author {
    color: #e2e8f0;
  }

  .comment-date {
    color: #a0aec0;
  }

  .comment-content {
    color: #e2e8f0;
  }

  .comment-replies {
    border-left-color: #2d3748;
  }

  .nested-comment {
    background: rgba(26, 32, 44, 0.5);
  }
}
</style>
