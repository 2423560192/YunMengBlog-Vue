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
  delete: id => request.delete(`/posts/${id}/`)
}

// 评论相关接口
export const commentApi = {
  getList: postId => request.get('/comments/', { params: { post_id: postId } }),
  create: data => request.post('/comments/', data),
  delete: id => request.delete(`/comments/${id}/`)
}

// 点赞相关接口
export const likeApi = {
  like: postId => request.post('/like/', { post_id: postId }),
  unlike: id => request.delete(`/like/${id}/`)
}

// 收藏相关接口
export const collectApi = {
  collect: postId => request.post('/collect/', { post_id: postId }),
  uncollect: id => request.delete(`/collect/${id}/`)
}
