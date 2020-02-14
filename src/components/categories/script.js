/*
  商品分类思路：

  1 展示商品分类列表
    描述：这个功能进入页面就要展示分类列表，因此，需要在 created 钩子函数中获取分类数据
    1.1 在 data 中提供分类列表数据( cateList )
    1.2 在 methods 中添加一个获取分类数据的方法（ getCateList ）
      1.2.1 查看接口文档，获取到当前接口名称/请求类型/参数
        参数：传入 1 表示获取一级菜单，传入 2 表示获取一级二级菜单， 传入 3 表示获取一级二级三级菜单
      1.2.2 发送请求，获取数据
      1.2.3 将数据交给 cateList
    1.3 在 created 钩子函数中调用这个方法 ( this.getCateList() )

  2 分页获取数据：
    只需要在 get 请求中添加：pagenum 和 pagesize 参数即可
    注意：如果传递了这两个参数，那么，服务器返回的数据格式与非分页情况下不同，因此，要注意
         返回数据格式

  3 element-tree-grid 的使用
    3.1 安装： npm i -S element-tree-grid
    3.2 在 该组件中导入 element-tree-grid
    3.3 注册为当前组件的局部组件

  4 添加分类功能：
    4.1 添加一个按钮，给按钮绑定单击事件
    4.2 点击按钮展示 添加分类 对话框
    4.3 展示 添加分类 对话框的时候，需要将所有的分类获取到并且展示
      添加分类需要选择父级分类，因此只需要获取到 一级和二级 分类即可
    4.4 添加分类：获取到分类名称和所属父级分类，并且根据接口文档来实现添加功能
*/

// 导入
import ElementTreeGrid from 'element-tree-grid'
// console.log(ElementTreeGrid.name)

export default {
  name: 'Categories',

  data () {
    return {
      // 分类列表数据
      cateList: [],
      // 记录总条数
      total: 0,

      // 表格数据加载中提示
      loading: true,

      // 控制添加分类对话框的展示和因此
      cateAddDialog: false,
      // 添加分类表单数据
      cateAddForm: {
        // 分类名称
        cat_name: '',
        // 分类的父级id
        // cat_id 会存储一级和二级分类的id，但是，添加的时候，只需要提供 数组最后一项值即可
        //  比如：[1, 3] 就提供 3
        //        [1] 就提供 1
        cat_pid: [],
        // 分类的级别
        //  cat_id 数组的长度 就是当前要添加菜单的级别
        cat_level: -1
      },

      // 父级分类数据
      cateAddList: []

      /* options: [{
        value: 'zhinan',
        label: '指南',
        // 2级
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          // 3级
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }]
      }] */
    }
  },

  created () {
    // 获取分类列表数据
    this.getCateList()
  },

  methods: {
    // 获取分类列表数据
    async getCateList (pagenum = 1) {
      const res = await this.$http.get(`/categories`, {
        params: {
          type: 3,
          // 添加这两个参数后，就能分页获取数据
          pagenum,
          pagesize: 10
        }
      })

      // console.log('商品分类：', res)
      const { meta, data } = res.data
      if (meta.status === 200) {
        // 分类列表数据
        this.cateList = data.result
        // 总条数
        this.total = data.total
        // 关闭加载中提示
        this.loading = false
      }
    },

    // 点击分页组件，获取当前页数据
    changePage (curPage) {
      // 每次加载某一页的数据，都需要将 loading 设置为true
      this.loading = true

      // 根据参数 curPage 来获取当前页的数据
      this.getCateList(curPage)
    },

    // 打开添加分类对话框
    showCateAddDialog () {
      this.cateAddDialog = true

      // 获取到父级分类
      this.getCateAddList()
    },

    // 获取一级和二级分类菜单
    async getCateAddList () {
      const res = await this.$http.get(`/categories`, {
        params: {
          type: 2
        }
      })

      const { meta, data } = res.data
      if (meta.status === 200) {
        // 分类列表数据
        this.cateAddList = data
      }
    },

    // 添加分类
    async addCate () {
      // 解构的同时给属性名起别名:
      let { cat_name: catName, cat_pid: catPid } = this.cateAddForm

      const res = await this.$http.post(`/categories`, {
        cat_name: catName,
        cat_pid: catPid[catPid.length - 1],
        cat_level: catPid.length
      })

      // console.log(res)
      const { meta } = res.data
      if (meta.status === 201) {
        // 关闭对话框
        this.cateAddDialog = false
        // 获取列表数据
        this.getCateList()
        // 重置表单
        this.cateAddForm.cat_name = ''
        this.cateAddForm.cat_pid = []
      }
    }
  },

  // 用于注册当前组件的局部组件
  components: {
    // 'el-table-tree-column': ElementTreeGrid

    // 使用ES6中的属性名表达式
    [ElementTreeGrid.name]: ElementTreeGrid
  }
}
