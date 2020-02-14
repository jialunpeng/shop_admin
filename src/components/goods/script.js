/*
  功能：

  1 展示商品列表
    1.1 在 data 提供一个 goodsList 数据
    1.2 在 methods 中提供一个获取数据的方法： getGoodsList
      1.2.1 查看接口文档，拿到：url/请求类型/参数
    1.3 在 created 钩子函数中调用该方法

  2 路由参数
    /goods/8 中的 8 实际上是一个：路由参数
      路由中， path: '/goods/:page?'
      :page? 表示当前路由参数是可选的，也就是说：参数可以有也可以没有
      这个路由规则能够匹配的哈希值为：1 /goods 2 /goods/8
      无法匹配： /goods1 或 /goods/1/a

  3 使用路由分页功能：
    3.1 进入页面，获取当前的路由参数（页码），应该在发送请求前，就获取到该页码
      this.$route.params.page
    3.2 第一次进入页面，执行 created 钩子函数中的方法
        每次修改哈希值中的页码，执行 watch 监视 $route 改变的方法
*/

export default {
  name: 'Goods',

  data () {
    return {
      // 商品列表数据
      goodsList: [],
      // 总条数
      total: 0,
      // 当前页
      curPage: 1
    }
  },

  created () {
    // console.log('页码为：', this.$route.params.page)
    this.getGoodsList(this.$route.params.page)
  },

  // 监视路由参数的变化
  // 当路由参数改变的时候，要根据当前页码，来获取对应页的数据
  watch: {
    $route (to, from) {
      // console.log('to:', to)
      this.getGoodsList(to.params.page)
    }
  },

  methods: {
    // 获取表格数据
    async getGoodsList (pagenum = 1) {
      const res = await this.$http.get(`/goods`, {
        params: {
          pagenum,
          pagesize: 5
        }
      })

      const { meta, data } = res.data

      if (meta.status === 200) {
        this.goodsList = data.goods
        this.total = data.total

        // console.log(typeof pagenum)
        // 设置当前页，注意：分页组件中需要的是 number 类型，所以， pagenum - 0 将字符串转化为number
        this.curPage = pagenum - 0
      }
    },

    // 索引号
    indexMethod (index) {
      return index + 1
    },

    // 切换页码
    changePage (page) {
      // 思路：直接修改哈希值中的页码为当前页码即可
      //      因为只要改变了哈希值，watch 就监视到哈希值发生改变，就会根据当前页来加载数据

      // 路由的编程式导航
      this.$router.push(`/goods/${page}`)
    }
  }
}
