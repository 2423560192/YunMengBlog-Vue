# YunMengBlog-Vue

一个使用 Vue.js 开发的现代化博客系统前端项目。

## 功能特点

- 📝 Markdown 编辑器支持
- 🏷️ 文章分类与标签管理
- 🌓 自适应暗色模式
- �� 文章草稿保存
- 🔍 文章目录导航
- 💬 评论互动系统
- ❤️ 点赞与收藏功能
- 🎨 现代化 UI 设计
- 🌐 国际化支持

## 技术栈

- Vue.js 2.x
- Vue Router
- Element UI
- V-MD-Editor
- Axios
- Particles.js

## 快速开始

### 环境要求

- Node.js >= 12.x
- npm >= 6.x

### 安装

```bash
# 克隆项目
git clone https://github.com/yourusername/YunMengBlog-Vue.git

# 进入项目目录
cd YunMengBlog-Vue

# 安装依赖
npm install

# 启动开发服务器
npm run serve
```

### 构建

```bash
# 构建生产环境版本
npm run build
```

## 项目结构

```
src/
├── api/          # API 接口
├── assets/       # 静态资源
├── components/   # 组件
├── i18n/         # 国际化
├── router/       # 路由配置
├── utils/        # 工具函数
├── App.vue       # 根组件
└── main.js       # 入口文件
```

## 主要功能

### 文章编辑

- Markdown 编辑器支持代码高亮
- 实时预览
- 自动保存草稿
- 文章分类和标签管理
- 图片上传支持

### 用户系统

- 用户注册/登录
- 个人信息管理
- 文章收藏
- 评论管理

### 其他功能

- 响应式设计
- 暗色模式支持
- 国际化支持
- 文章目录导航

## 配置说明

### 环境变量

在项目根目录创建 `.env` 文件：

```
VUE_APP_API_URL=http://your-api-url
VUE_APP_TITLE=Your Blog Title
```

### API 配置

修改 `src/utils/request.js` 中的配置：

```javascript
const baseURL = process.env.VUE_APP_API_URL || 'http://localhost:8000/api'
```

## 开发指南

### 添加新组件

1. 在 `src/components` 目录下创建组件文件
2. 使用 Vue 单文件组件格式 (.vue)
3. 在需要使用的地方导入并注册组件

### 样式指南

- 使用 BEM 命名规范
- 支持暗色模式
- 使用 CSS 变量管理主题

## 部署

### 使用 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

## 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解更多信息
