<template>
  <div class="env-test">
    <h1>环境配置测试</h1>
    <el-card>
      <h2>当前环境配置</h2>
      <el-table :data="envData" stripe>
        <el-table-column prop="name" label="变量名"></el-table-column>
        <el-table-column prop="value" label="变量值"></el-table-column>
      </el-table>
    </el-card>

    <el-divider></el-divider>

    <h2>环境判断</h2>
    <el-alert
      v-if="isDev"
      title="当前为开发环境"
      type="success"
      :closable="false"
    ></el-alert>
    <el-alert
      v-if="isProd"
      title="当前为生产环境"
      type="warning"
      :closable="false"
    ></el-alert>

    <el-divider></el-divider>

    <h2>API 请求测试</h2>
    <el-card>
      <el-input v-model="apiPath" placeholder="API 路径，例如: /categories/" style="margin-bottom: 15px">
        <template slot="prepend">
          <span>{{ fullApiUrl }}</span>
        </template>
      </el-input>
      <el-button type="primary" @click="testApiRequest" :loading="loading">测试请求</el-button>

      <div v-if="apiResponse" class="api-response">
        <h3>响应结果</h3>
        <pre>{{ apiResponseFormatted }}</pre>
      </div>

      <div v-if="apiError" class="api-error">
        <h3>请求错误</h3>
        <el-alert
          :title="apiError"
          type="error"
          :closable="false"
        ></el-alert>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as env from '../utils/env'
import axios from 'axios'

export default {
  name: 'EnvTest',
  data () {
    return {
      isDev: env.isDev(),
      isProd: env.isProd(),
      envData: [
        { name: '环境名称', value: env.getEnv() },
        { name: 'API URL', value: env.getApiUrl() },
        { name: '应用模式', value: env.getAppMode() },
        { name: '应用版本', value: env.getAppVersion() },
        { name: '应用标题', value: env.getAppTitle() },
        { name: 'axios baseURL', value: axios.defaults.baseURL }
      ],
      apiPath: '/categories/',
      apiResponse: null,
      apiError: null,
      loading: false
    }
  },
  computed: {
    fullApiUrl () {
      return axios.defaults.baseURL
    },
    apiResponseFormatted () {
      return this.apiResponse ? JSON.stringify(this.apiResponse, null, 2) : ''
    }
  },
  methods: {
    async testApiRequest () {
      this.loading = true
      this.apiResponse = null
      this.apiError = null

      try {
        const path = this.apiPath.startsWith('/') ? this.apiPath : `/${this.apiPath}`
        const response = await this.$axios.get(path)
        this.apiResponse = response.data
      } catch (error) {
        console.error('API 请求错误:', error)
        this.apiError = error.response
          ? `错误 ${error.response.status}: ${error.response.statusText}`
          : error.message || '未知错误'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.env-test {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1, h2, h3 {
  margin-bottom: 20px;
}

.el-divider {
  margin: 30px 0;
}

.api-response {
  margin-top: 20px;
}

.api-response pre {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
}

.api-error {
  margin-top: 20px;
}
</style>
