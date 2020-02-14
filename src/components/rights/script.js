/*
  思路:
  1 在 data 中提供权限列列表数据
  2 在 methods 中添加一个方法
  3 因为进入页面就要获取数据,因此在 created 钩子函数中调用该方法
*/

export default {
  name: 'Rights',

  data () {
    return {
      // 权限列表数据
      rightsList: []
    }
  },

  created () {
    this.getRightsList()
  },

  methods: {
    /**
     * 获取权限列表数据
     */
    async getRightsList () {
      // 思路:
      // 1 查看接口文档,找到接口
      // 2 根据接口的地址/参数/请求方式来使用axios发送请求
      // 3 从接口返回的数据中获取到需要的数据,交给 rightsList
      const res = await this.$http.get(`rights/list`)

      const { meta, data } = res.data

      if (meta.status === 200) {
        this.rightsList = data
      }
    },

    /**
     * 给表格提供索引号列
     * @param {number} index 索引号
     */
    indexMethod (index) {
      return index
    }
  }
}
