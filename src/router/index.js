// 导入Vue
import Vue from 'vue'
// 导入路由
import Router from 'vue-router'

// 导入登录组件
import Login from '@/components/login/Login'

// 修改后，每个 () => import() 都会生成一个独立的JS文件
// 也就是说：只要使用这个语法，就是告诉  webpack 这就是一个 代码分割点，这样生成一个独立的js文件，来实现按需加载的功能
const Home = () => import(/* webpackChunkName: 'home' */ '@/components/home/Home')
const UserList = () => import(/* webpackChunkName: 'userlist' */'@/components/user-list')
const Rights = () => import(/* webpackChunkName: 'rights' */'@/components/rights')
const Roles = () => import(/* webpackChunkName: 'roles' */'@/components/roles')
const Categories = () => import(/* webpackChunkName: 'categories' */'@/components/categories')

// 说明：webpackChunkName 相同，那么，这两个组件会被打包生产一个JS文件
const Goods = () => import(/* webpackChunkName: 'goods' */'@/components/goods')
const GoodsAdd = () => import(/* webpackChunkName: 'goods' */'@/components/goods-add')

/* // 导入Home组件
import Home from '@/components/home/Home'
// 导入user-list组件，可以省略 index.vue
import UserList from '@/components/user-list'
// 导入rights组件
import Rights from '@/components/rights'
// 导入roles组件
import Roles from '@/components/roles'
// 导入categories组件
import Categories from '@/components/categories'
// 导入goods组件
import Goods from '@/components/goods'
// 导入goods-add组件
import GoodsAdd from '@/components/goods-add' */

// 安装路由插件
Vue.use(Router)

// 创建路由对象，配置路由规则
const router = new Router({
  // 去掉 #，启用HTML5history模式
  mode: 'history',
  routes: [
    { path: '/', redirect: '/home' },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,

      // 嵌套路由：
      children: [
        {
          // path: '/user-list',
          // 此处的路由与左侧菜单中给的 path 值一致
          path: '/users',
          component: UserList
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          // ? 表示该路由参数是可选的，可以不传
          path: '/goods/:page?',
          component: Goods
        },

        // 我们希望这个组件被缓存，就给这个组件添加 meta
        {
          path: '/goods-add',
          component: GoodsAdd,

          // meta 是固定的配置项，用来给路由添加一些额外的数据信息
          meta: {
            keepAlive: true
          }
        }
      ]
    }
  ]
})

// 通过路由的导航守卫来实现登录状态的判断
// 只有登录成功后，才能进入首页
// 如果没有登录，就跳转到 登录页面 让用户登录

/*
  登录的说明：
  在登录成功后，服务器会返回一个 token 数据
  这个 token 就是登录成功的标记，只要登录成功，服务端就会返回一个 token
  那么，我们直接通过判断有没有token，就可以知道这个人有没有登录了

  就好比：去电影院看电影，需要买票才能看

  电影院：任何人都可以去，就好比：网站谁都可以访问
  虽然任何人都可以进电影院，但是只有买票的人，才能看电影
  虽然任何人都可以访问我们的网站，但是，只有登录成功的人，才能进入后台的首页（/home）
*/

router.beforeEach((to, from, next) => {
  // 如果是登录页面，直接放行
  // to.path 就是当前的哈希值，通过这个属性，可以判断是不是指定的页面
  if (to.path === '/login') {
    // next()
    // return
    return next()
  }

  // 1 先从 localStorage 中取出token
  const token = localStorage.getItem('token')

  if (token) {
    // 有token，说明登录成功了，直接放行
    next()
  } else {
    // 没有token，没有登录，就跳转到登陆页面让用户登录
    next('/login')
  }
})

// 指定路由的导航守卫：
/* router.beforeEach((to, from, next) => {
  // to：  到哪去（路由对象）
  // from：从哪来（路由对象）
  // next()：放行的信号，如果调用 next 方法，那么组件就会展示出来；如果没有调用这个方法
  //         那么， 组件就不会展示在页面中
  console.log('你访问页面了，经过了导航守卫：', to, from)

  // next()
  // 参数：表示要进入到哪个页面
  // next('/login')
}) */

export default router
