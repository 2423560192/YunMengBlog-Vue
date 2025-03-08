import request from '../utils/request'

// 用户相关接口
export const userApi = {
  register: data => request.post('/register/', data),
  login: data => request.post('/login/', data),
  getUserInfo: () => request.get('/user/'),
  updateUserInfo: data => request.put('/user/', data)
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
