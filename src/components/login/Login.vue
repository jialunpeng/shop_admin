<template>
  <div class="login">
    <!--
      el-form 表示使用了 表单组件

      ref 在vue中是一个特殊的属性，给组件或者HTML元素添加该属性后，
      可以在 js 中通过 this.$refs.loginForm 来获取到当前组件或这DOM对象
    -->
    <el-form class="login-form" ref="loginForm" :model="loginForm" label-width="80px" :rules="rules" :label-position="labelPosition">
      <!--
        el-form-item 是表单元素中的一行
        label 表示当前行的文字提示

        prop 是配合 表单校验 的属性
       -->
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <!-- 给组件绑定事件的时候，如果发现绑定的事件不生效，那么，可以添加 .native 修饰符 -->
        <el-input v-model="loginForm.password" type="password" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 1 导入axios
// import axios from 'axios'

export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },

      // 表单验证规则：
      rules: {
        username: [
          // required 表示为必填项
          // message 验证失败时的提示
          // trigger 表示什么时候触发表单验证
          { required: true, message: '用户名为必填项', trigger: 'blur' },

          // min 和 max 分别指定：当前表单的长度
          { min: 4, max: 12, message: '用户名长度为：4-12个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码为必填项', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度为：6-12个字符', trigger: 'blur' }
        ]
      },

      // 表单标签文字提示的位置
      labelPosition: 'top'
    }
  },
  methods: {
    /**
     * 登录方法
     */
    login () {
      // 表单校验的代码：
      // 先进行表单验证，验证成功后，再进行登录
      // console.log(this.$refs.loginForm)

      // this.$refs.loginForm 是用来获取到页面中的组件或DOM对象
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // 表单验证成功时执行的代码
          this.handleLogin()
        } else {
          // 表单验证失败的代码
          return false
        }
      })
    },

    /**
     * 登录逻辑
     */
    async handleLogin () {
      const url = 'http://localhost:8888/api/private/v1/login'
      // 使用 await 等待这个异步请求成功：
      const res = await this.$http.post(url, this.loginForm)

      // 从 res 中获取到成功后的数据:
      const data = res.data
      if (data.meta.status === 200) {
        // 成功：
        localStorage.setItem('token', data.data.token)
        this.$router.push('/home')
        this.$message({
          message: '登录成功',
          type: 'success',
          duration: 500
        })
      } else {
        // 登录失败，提示用户登录失败
        // console.log('登录失败：', res)
        this.$message({
          message: '登录失败：用户名或密码错误',
          type: 'error',
          duration: 1000
        })
      }
    },

    /**
     * 重置
     */
    reset () {
      this.$refs.loginForm.resetFields()
    }
  }
}
</script>

<style>
  .login {
    height: 100%;
    background-color: #2d434c;
  }

  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 500px;
    padding: 35px;
    margin-top: -120px;
    margin-left: -250px;
    border-radius: 12px;
    background-color: #fff;
  }
</style>
