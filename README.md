# shop_admin

## 功能描述

## 关闭ESLint

- 在 `/config/index.js` 中将 useEslint 设置为：false

## 初始化项目

- 将 `src` 目录中原来默认生成的内容，全部删除

```html
源码全部放在 src 目录，只要修改 src 目录中的内容即可：

/assets           资源文件夹，放：图片、样式等等
/components       组件文件夹，所有的组件，都放到该目录中，并且每个组件都使用文件夹包裹
/router           路由
  index.js        配置路由的js文件
App.vue           根组件，就包含一个路由出口 <router-view></router-view>
main.js           整个项目的入口，也是webpack打包的入口
```

## 如何开一个新功能

- 1 在 `components` 目录中创建组件
- 2 在 `router/index.js` 中配置路由

## Element-UI的使用

- 1 安装：`npm i element-ui -S`
- 2 在 `main.js` 文件中导入element-ui的js和样式，并且安装称为插件

```js
import Vue from 'vue'
// 1 导入EelmentUI
import ElementUI from 'element-ui'
// 2 导入 ElementUI的样式
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
// 3 安装插件
Vue.use(ElementUI)

new Vue({
  el: '#app',
  render: h => h(App)
})
```

- 3 打开element-ui的文档，从左侧菜单中找到对应的组件，参考示例代码，复制到自己页面中使用即可

## axios发送请求

- 1 安装：`npm i -S axios`
- 2 导入：`import axios from 'axios'`
- 3 使用：`axios.post(接口地址, 参数).then(成功).catch(失败)`

## vue-router 编程式导航

- 通过JS代码来实现跳转：`this.$router.push('/home')`

## token 验证机制

- [彻底理解cookie，session，token](https://www.cnblogs.com/moyand/p/9047978.html)
- [权限认证 cookie VS token](https://www.cnblogs.com/lihuanqing/p/8485071.html)

## 样式写在哪

- 说明：全局样式写在 `index.css` 中，组件的样式写在自己组件的style中

## 在组件中使用预编译CSS

- 直接安装loader的包：`npm i -D less-loader less` 就可以使用 Less 了

## 抽离单文件组件的内容

- 说明：如果将所有的template、script、style都放在 .vue 文件中，那么，这个文件会变的非常臃肿。可以将 不同的内容，抽离到单独的文件中

```html
<!-- 将 模板 抽离到，当前目录下的：template.html文件中 -->
<template src="./template.html"></template>
<!-- 将 js 抽离到，当前目录下的：script.js文件中 -->
<script src="./script.js"></script>
<!-- 将 style 抽离到，当前目录下的：style.css文件中 -->
<style src="./style.css"></style>
```

## 带token请求接口

- 说明：除了登录接口以外，其他接口都需要 token 才能够成功获取数据

```js
axios
// 通过第二个参数的 params 来给 get 请求传递参数
  .get('http://localhost:8888/api/private/v1/users', {
    params: {
      query: '',
      pagenum: 1,
      pagesize: 3
    },
    // 因为这个接口是需要登录后才能够访问的，所以，需要将 token 作为
    // 请求头中的一个属性来传递给服务器，这样，服务器才会知道我们已经登录成功
    headers: {
      Authorization: localStorage.getItem('token')
    }
  })
  .then(res => {
    console.log('用户列表获取成功：', res)    if (res.data.meta.status === 200) {
      // 获取数据成功
      this.userList = res.data.data.users
    }
  })
```

## 配置 axios

- 使用 `axios` 的痛点

```html
1 每个组件中都需要单独引入 axios
2 发送请求的时候，url每次都要写一个固定的前缀
3 每个接口都需要设置 Authorization header
```

- 解决上述问题1：
  - 达到的效果：只需要引入一次，各个组件中直接使用即可
  - 解决方式：将 axios 添加到 Vue.prototype 原型中

- 解决上述问题2:
  - 达到的效果：每次请求，只写当前请求的接口地址
  - 解决方式：配置 axios 的 defaults.baseUrl

- 解决上述问题3:
  - 达到的效果：配置一次，而不是每个接口中都传递 header
  - 解决方式：配置 axios 的请求拦截器，统一添加 Authorization header

## 点击分配权限按钮,展示对话框 - 数据修改和DOM更新的问题

- 问题描述:

```html
因为 权限对话框 一开始隐藏的, 所以 Vue 是不会渲染该对话框的DOM内容的
接下来, 我们将控制权限对话框显示和隐藏的数据（assignRightsDialog）, 修改为: true( assignRightsDialog = true )
但是, Vue 是异步更新DOM的, 也就是说: 更新数据后, DOM还没有立即更新(也就是: 对话框在DOM中还没有出现)
所以, 此时, 直接通过 this.$refs.rightsTree 无法获取到该组件(DOM内容)
```

- 解决问题:

```js
// 在修改数据后, 可以在 $nextTick() 的回调函数中, 获取到更新后的DOM内容
this.$nextTick(() => {
  // 回调函数会在DOM更新后立即执行，此时，权限对话框已经出现在DOM中了
  // 所以，此处，就可以获取到 树形控件了

  // 在此处获取 this.$refs.rightsTree 就可以获取到了
  this.$refs.rightsTree
})
```

## element-tree-grid

- 1 安装：`npm i -S element-tree-grid`
  - [element-tree-grid](https://github.com/foolishchow/element-tree-grid)
- 2 在 main.js 中，注册全局组件：

```js
import ElTreeGrid from 'element-tree-grid'
Vue.component(ElTreeGrid.name, ElTreeGrid)
```

```html
<!--
  label ：设置列名称
  prop ：提供列内容的属性名
  tree-key ：区分其他菜单，不添加该key会导致所有菜单同时展开，添加该key只展开该菜单
  level-key ：设置菜单级别，以缩进形式表示子菜单
  child-key ：指定子菜单的属性名称
  parent-key ：父级菜单id，不添加该key，则无法收起子菜单
 -->

<el-table-tree-column
  label="分类名称"
  prop="cat_name"
  tree-key="cat_id"
  level-key="cat_level"
  child-key="children"
  parent-key="cat_pid"
  width="320"
  :indent-size="20">
  <template slot-scope="scope">
    <span>{{ scope.row.cat_name }}</span>
  </template>
</el-table-tree-column>
```

## 用户管理 - 分配角色

- 1 点击分配角色按钮，展示对话框
- 2 展示用户名以及所有的角色列表
  - Select 选择器 组件
- 3 选中当前用户的角色
- 4 获取到当前选中的角色，给当前用户分配角色
  - 查看接口，需要什么样的数据，就获取什么数据，然后，发送请求

## 左侧菜单的展示

- 权限 和 菜单 是关联在一起的，也就是说：具有这个权限才会有对应的菜单
- 不同的用户具有不同的角色，而不同的角色具有不同的权限，也就是：具有不同菜单

- 问题：在获取左侧菜单的时候，没有传递 userId 这样能区分不同用户的信息，但是每个用户登录后，左侧菜单还是不同的，内部是如何区分不同用户的呢？
  - 答案：服务端通过 token 来区分不同用户，说明 token 中包含了 userId 这样区分用户id的数据

## quill-editor

- 安装：`npm i -S vue-quill-editor`
- [vue-quill-editor](https://github.com/surmon-china/vue-quill-editor)

```html
<quill-editor
  v-model="goodsFormAdd.goods_introduce"
  class="goods-editor">
</quill-editor>
```

## 按需加载

- 1 修改 `router/index.js` 中导入组件的语法

```js
// 使用：
const Home = () => import('@/components/home/Home')
// 替换：
// import Home from '@/components/home/Home'

// 给打包生产的JS文件起名字
const Home = () => import(/* webpackChunkName: 'home' */ '@/components/home/Home')

// chunkName相同，将 goods 和 goods-add 两个组件，打包到一起
const Goods = () => import(/* webpackChunkName: 'goods' */'@/components/goods')
const GoodsAdd = () => import(/* webpackChunkName: 'goods' */'@/components/goods-add')
```

- 2 （*该步可省略*）修改 `/build/webpack.prod.conf.js` 中的chunkFilename

```js
{
  // [name] 代替 [id]
  chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
}
```

## 使用CDN

- [开源项目 CDN 加速服务](https://www.bootcdn.cn/)

- 1 在 `index.html` 中引入CDN提供的JS文件
- 2 在 `/build/webpack.base.conf.js` 中（resolve前面）添加配置 externals
- **注意**：通过CDN引入 element-ui 的样式文件后，就不需要在 main.js 中导入 element-ui 的CSS文件了。所以，直接注释掉 main.js 中的导入 element-ui 样式即可

- `externals`配置：

```js
externals: {
  // 键：表示 导入包语法 from 后面跟着的名称
  // 值：表示 script 引入JS文件时，在全局环境中的变量名称
  vue: 'Vue',
  axios: 'axios',
  'vue-router': 'VueRouter',
  'element-ui': 'ELEMENT',

  BMap: 'BMap',
  echarts: 'echarts',
}

import ElementUI from 'element-ui'
```

### 常用包CDN

- [vue](https://cdn.jsdelivr.net/npm/vue@2.5.2/dist/vue.min.js)
- [vue-router](https://unpkg.com/vue-router@3.0.1/dist/vue-router.min.js)
- [axios](https://unpkg.com/axios/dist/axios.min.js)
- [element-ui JS](https://unpkg.com/element-ui/lib/index.js)
- [element-ui CSS](https://unpkg.com/element-ui/lib/theme-chalk/index.css)

- 说明：
  - 1 先在官方文档查找提供的CDN
  - 2 如果没有，在 `https://www.bootcdn.cn/` 或其他 CDN提供商 查找

## 缓存和保留组件状态

- [keep-alive](https://www.jianshu.com/p/0b0222954483)
- 解决方式：使用 `keep-alive` ，步骤如下：

```html
1 在需要被缓存组件的路由中添加 meta 属性
  meta 属性用来给路由添加一些元信息（其实，就是一些附加信息）
{
  path: '/',
  name: 'home',
  component: Home,
  // 需要被缓存
  meta: {
    keepAlive: true
  }
}

2 修改路由出口，替换为以下形式：
  根据 meta 是否有 keepAlive 属性，决定该路由是否被缓存
<keep-alive>
  <!-- 这里是会被缓存的视图组件 -->
  <router-view v-if="$route.meta.keepAlive">
  </router-view>
</keep-alive>

<!-- 这里是不被缓存的视图组件 -->
<router-view v-if="!$route.meta.keepAlive">
</router-view>
```

## 启用路由的 History 模式

- 通过在路由中添加 `mode: 'history'` 可以去掉 浏览器地址栏中的 #
- 在开发期间，只需要添加这个配置即可
- 但是，在项目打包以后，就会出现问题

```html
// 去掉 # 后，地址变为：

http://localhost:8080/goods

那么，服务器需要正确处理 /goods 才能正确的响应内容，
但是，/goods 不是服务端的接口，而是 用来在浏览器中实现 VueRouter 路由功能的
```

### 后端的处理方式

- 1 优先处理静态资源
- 2 对于非静态资源的请求，全部统一处理返回 index.html
- 3 当浏览器打开 index.html 就会加载 路由的js 文件，那么路由就会解析 URL 中的 /login 这种去掉#的路径了

## 启动

```js
npm install
npm run dev

访问：http://localhost:8080

用户名：admin
密码：123456
```

