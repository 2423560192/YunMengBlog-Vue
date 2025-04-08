import request from '../utils/request'

// 用户相关接口
export const userApi = {
  // 用户注册
  register (data) {
    return request({
      url: '/register/',
      method: 'post',
      data
    })
  },
  // 用户登录
  login (data) {
    return request({
      url: '/login/',
      method: 'post',
      data
    })
  },
  // 获取用户信息
  getInfo () {
    return request({
      url: '/user/',
      method: 'get'
    })
  },
  // 更新用户信息
  updateInfo (data) {
    return request({
      url: '/user/',
      method: 'put',
      data
    })
  }
}

// 文章相关接口
export const postApi = {
  getList: params => request.get('/posts/', { params }),
  getDetail: id => request.get(`/posts/${id}/`),
  create: data => request.post('/posts/', data),
  update: (id, data) => request.put(`/posts/${id}/`, data),
  delete: id => request.delete(`/posts/${id}/`),
  // 根据分类获取文章列表
  getPostsByCategory: categoryName => request.get('/posts/filter/', {
    params: { category_name: categoryName }
  })
}

// 评论相关接口
export const commentApi = {
  getList: params => request.get('/comments/', { params }),
  create: data => request.post('/comments/', data),
  delete: id => request.delete(`/comments/${id}/`)
}

// 点赞相关接口
export const likeApi = {
  // 点赞
  like: postId => request.post('/like/', { post_id: postId }),

  // 取消点赞 - 使用 post_id 而不是 like_id
  unlike: postId => request.delete(`/like/${postId}/`),

  // 获取点赞状态
  getStatus: postId => request.get(`/like/status/${postId}/`)
}

// 收藏相关接口
export const collectApi = {
  // 收藏文章
  collect: postId => request.post('/collect/', { post_id: postId }),

  // 取消收藏
  uncollect: postId => request.delete(`/collect/${postId}/`),

  // 获取收藏状态
  getStatus: postId => request.get(`/collect/status/${postId}/`)
}

export const categoryApi = {
  getList () {
    return request({
      url: '/categories/',
      method: 'get'
    })
  },
  create (data) {
    return request({
      url: '/categories/',
      method: 'post',
      data
    })
  }
}

// 添加标签相关接口
export const tagApi = {
  getList () {
    return request({
      url: '/tags/',
      method: 'get'
    })
  },
  create (data) {
    return request({
      url: '/tags/',
      method: 'post',
      data
    })
  }
}
