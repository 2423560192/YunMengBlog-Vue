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

项目使用 Vue CLI 的环境变量系统，支持多环境配置。项目中包含以下环境配置文件：

- `.env` - 基础环境配置，适用于所有环境
- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置

各环境变量说明：

```
# 基础环境变量
VUE_APP_TITLE=云梦博客          # 应用标题
VUE_APP_VERSION=0.1.0          # 应用版本

# 环境特定变量
NODE_ENV=development|production # 环境名称
VUE_APP_API_URL=http://xxx      # API 基础地址（注意：不要包含 /api 后缀）
VUE_APP_MODE=development|production # 应用模式
VUE_APP_BASE_URL=/              # 应用部署路径
```

### API URL 配置注意事项

1. 环境变量 `VUE_APP_API_URL` 中**不要**包含 `/api` 后缀，例如：
   - 正确：`http://localhost:8000`
   - 错误：`http://localhost:8000/api`

2. 前端代码中发送请求时应使用 `/api` 作为基础路径，如：
   ```js
   axios.get('/api/categories/') // 正确
   axios.get('/categories/')     // 错误
   ```

3. 在代码中使用 env 工具类获取环境变量：
   ```js
   import { getApiUrl } from '@/utils/env'
   const baseUrl = getApiUrl() // 返回不包含 /api 的基础 URL
   ```

### 使用不同环境

```bash
# 开发环境
npm run serve:dev

# 生产环境运行
npm run serve:prod

# 开发环境构建
npm run build:dev

# 生产环境构建
npm run build:prod
```

### API 配置

API 地址现在通过环境变量配置，您可以使用环境工具类简化使用：

```javascript
// 引入环境工具
import { getApiUrl, isDev, isProd } from '@/utils/env'

// 获取 API URL
const apiUrl = getApiUrl()

// 根据环境执行不同代码
if (isDev()) {
  console.log('开发环境运行')
} else if (isProd()) {
  console.log('生产环境运行')
}
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

## 环境隔离实施说明

本项目实现了线上线下环境隔离，主要通过以下方式实现：

### 1. 环境配置文件

- `.env`: 基础环境配置，适用于所有环境
- `.env.development`: 开发环境配置
- `.env.production`: 生产环境配置

### 2. 环境工具类

创建了 `src/utils/env.js` 工具类，提供了获取环境变量和判断环境的便捷方法：

```javascript
// 判断是否为开发环境
isDev()

// 判断是否为生产环境 
isProd()

// 获取API地址
getApiUrl()

// 获取更多环境变量
getAppMode(), getAppVersion(), getAppTitle()
```

### 3. 启动与构建命令

- 开发环境启动: `npm run serve:dev`
- 生产环境构建: `npm run build:prod`

### 4. 测试页面

- 访问 `/env-test` 路径可以查看当前环境配置信息

### 5. API地址配置

API 地址现在统一通过环境变量配置，避免了硬编码：

- 开发环境: `http://localhost:8000/api`
- 生产环境: `https://api.yunmeng-blog.com/api`

### 6. 注意事项

- 不要在代码中直接使用 `process.env.XXX`，应该使用 `env.js` 工具类提供的方法
- 敏感信息（如密钥）不要提交到版本控制系统
- 可以添加 `.env.local` 文件进行本地环境配置（此文件不应提交到版本控制系统）
