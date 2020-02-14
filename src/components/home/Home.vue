<template>
  <el-container class="home">
    <!-- 头部 -->
    <el-header class="home-header">
      <!-- Layout 栅格布局 -->
      <el-row class="home-header-row">
        <!-- :span 表示每列的宽度 -->
        <el-col :span="8">
          <img src="@/assets/logo.png" alt="黑马程序员">
        </el-col>
        <el-col :span="8">
          <h1>电商后台管理系统</h1>
        </el-col>
        <el-col :span="8" class="home-header-logout">
          <span>欢迎<b>admin管理员</b></span>
          <a href="javascript:;" @click.prevent="logout">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="home-container">
      <!-- 侧边栏 -->
      <el-aside width="200px" class="home-aside">
        <!-- <input type="checkbox" :checked=" false "> -->
        <!--
          el-menu 表示：左侧菜单
          el-submenu 表示：表示每一个子菜单
            template 表示：一级菜单的图标和菜单名称
          el-menu-item 表示：每一个二级菜单

          index 属性：
            1 不能重复
            2 用来实现菜单高亮（配合 default-active 属性）

          unique-opened 如果值为true，那么同时只会有一个菜单展开

          :router="true" 表示：启用路由，启用后，index 就是 路由的哈希值

          :default-active="$route.path.slice(1)"
            表示默认激活的菜单，$router.path 获取到的是： '/rights' 但是，菜单的index只包含 'rights' 内容，所以，需要将 '/rights' 中的 '/' 排除掉
            :default-active="'/' + $route.path.split('/')[1]"
         -->

        <!-- 动态生成左侧菜单结构 -->
        <el-menu
          :router="true"
          :unique-opened="true"
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">

          <!-- 子菜单 ： 一级菜单 -->
          <el-submenu :index=" '/' + menu1.path " v-for="menu1 in menuList" :key="menu1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ menu1.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + menu2.path" v-for="menu2 in menu1.children" :key="menu2.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ menu2.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>

      </el-aside>
      <el-main class="home-content">
        <!-- 配置子路由的出口： -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () {
    // 获取菜单
    this.getMenuList()
  },

  data () {
    return {
      // 左侧菜单数据
      menuList: []
    }
  },

  methods: {
    // 加载左侧菜单
    async getMenuList () {
      const res = await this.$http.get('/menus')

      // console.log(res)
      const { meta, data } = res.data
      if (meta.status === 200) {
        this.menuList = data

        console.log(this.menuList)
      }
    },

    /**
     * 退出
     *
     * 退出要做什么？
     * 1 跳转到登录页
     * 2 清理token
     */
    logout () {
      // 为了用户体验，添加一个确认框，当用户确认退出后，再退出
      this.$confirm('您是否确定退出', '提示', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        this.$router.push('/login')

        this.$message({
          type: 'success',
          message: '退出成功'
        })
      })
    }
  }
}
</script>

<style lang="less">
  .home {
    height: 100%;
  }
  .home-header {
    background-color: #B3C1CD;
  }
  .home-header-row {
    line-height: 60px;
  }
  .home-header-row h1 {
    margin: 0;
    text-align: center;
    font-size: 36px;
    color: #fff;
  }
  .home-header-logout {
    text-align: right;
    font-weight: bolder;
  }
  .home-header-logout a {
    color: #B07A17;
  }

  .home-aside {
    background-color: #545C64;
  }

  .home-content {
    background-color: #EAEEF1;
  }
</style>
