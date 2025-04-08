const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  // 打包输出目录
  outputDir: 'dist',
  // 静态资源目录
  assetsDir: 'static',
  // 是否使用hash文件名
  filenameHashing: true,
  // 生产环境不生成 sourceMap
  productionSourceMap: process.env.NODE_ENV !== 'production',
  // 开发服务器配置
  devServer: {
    port: 8080,
    open: true,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_URL || 'http://localhost:8000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  // 全局样式变量
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            // 主题变量
            'primary-color': '#1890ff',
            'success-color': '#52c41a',
            'warning-color': '#faad14',
            'error-color': '#f5222d',
          },
          javascriptEnabled: true
        }
      }
    }
  },
  // 打包配置
  configureWebpack: {
    // 设置环境变量
    plugins: [
      // 可以在这里添加其他插件
    ]
  },
  // 路径配置
  publicPath: process.env.VUE_APP_BASE_URL || '/'
})
