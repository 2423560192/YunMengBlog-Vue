<template>
  <Home>
    <div class="message-board">
      <h2 class="page-title">留言板</h2>

      <!-- 留言表单 -->
      <div class="message-form">
        <div class="form-group">
          <textarea
            v-model="newMessage"
            class="form-control"
            rows="4"
            placeholder="写下你想说的话..."
          ></textarea>
        </div>
        <div class="form-actions">
          <button class="btn-submit" @click="submitMessage">
            发表留言 <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>

      <!-- 留言列表 -->
      <div class="messages-list">
        <div v-for="message in messages"
             :key="message.id"
             class="message-item">
          <div class="message-header">
            <img :src="message.avatar" :alt="message.username" class="user-avatar">
            <div class="message-info">
              <h5 class="username">{{ message.username }}</h5>
              <span class="date">{{ message.date }}</span>
            </div>
          </div>
          <p class="message-content">{{ message.content }}</p>
          <div class="message-actions">
            <button class="btn-action" @click="likeMessage(message)">
              <i class="fas fa-heart"></i> {{ message.likes }}
            </button>
            <button class="btn-action" @click="replyMessage(message)">
              <i class="fas fa-reply"></i> 回复
            </button>
          </div>
          <!-- 回复列表 -->
          <div v-if="message.replies && message.replies.length" class="replies">
            <div v-for="reply in message.replies"
                 :key="reply.id"
                 class="reply-item">
              <div class="reply-header">
                <img :src="reply.avatar" :alt="reply.username" class="user-avatar-sm">
                <div class="reply-info">
                  <h6 class="username">{{ reply.username }}</h6>
                  <span class="date">{{ reply.date }}</span>
                </div>
              </div>
              <p class="reply-content">{{ reply.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Home>
</template>

<script>
import Home from './Home.vue'

export default {
  name: 'MessageBoard',
  components: {
    Home
  },
  data () {
    return {
      newMessage: '',
      messages: [
        {
          id: 1,
          username: '张三',
          avatar: 'https://via.placeholder.com/40',
          content: '博主写的文章都很有深度，学到了很多！',
          date: '2024-03-15',
          likes: 12,
          replies: [
            {
              id: 101,
              username: '博主',
              avatar: 'https://via.placeholder.com/40',
              content: '谢谢支持！',
              date: '2024-03-15'
            }
          ]
        },
        {
          id: 2,
          username: '李四',
          avatar: 'https://via.placeholder.com/40',
          content: '期待更多技术分享！',
          date: '2024-03-14',
          likes: 8,
          replies: []
        }
      ]
    }
  },
  methods: {
    submitMessage () {
      if (!this.newMessage.trim()) return

      const message = {
        id: this.messages.length + 1,
        username: '访客',
        avatar: 'https://via.placeholder.com/40',
        content: this.newMessage,
        date: new Date().toLocaleDateString('zh-CN'),
        likes: 0,
        replies: []
      }

      this.messages.unshift(message)
      this.newMessage = ''

      this.$bvToast.toast('留言发表成功！', {
        title: '提示',
        variant: 'success',
        solid: true
      })
    },
    likeMessage (message) {
      message.likes++
      this.$bvToast.toast('点赞成功！', {
        title: '提示',
        variant: 'success',
        solid: true
      })
    },
    replyMessage (message) {
      const reply = prompt('请输入回复内容：')
      if (reply) {
        message.replies.push({
          id: Date.now(),
          username: '访客',
          avatar: 'https://via.placeholder.com/40',
          content: reply,
          date: new Date().toLocaleDateString('zh-CN')
        })
      }
    }
  }
}
</script>

<style scoped>
.message-board {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
}

.page-title {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 300;
}

.message-form {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-submit {
  background: #3273dc;
  color: white;
  border: none;
  padding: 0.5rem 2rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  background: #2366d1;
  transform: translateY(-2px);
}

.message-item {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.message-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-avatar-sm {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.message-info {
  flex: 1;
}

.username {
  margin: 0;
  font-size: 1rem;
  color: #2c3e50;
}

.date {
  font-size: 0.85rem;
  color: #666;
}

.message-content {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.message-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.btn-action {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-action:hover {
  color: #3273dc;
}

.replies {
  margin-left: 2rem;
  padding-left: 1rem;
  border-left: 2px solid #eee;
}

.reply-item {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.reply-content {
  color: #2c3e50;
  margin: 0;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .message-board {
    padding: 1rem;
  }

  .replies {
    margin-left: 1rem;
  }
}
</style>
