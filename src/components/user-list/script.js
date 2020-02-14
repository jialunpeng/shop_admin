// 导入 axios
// import axios from 'axios'

export default {
  // 指定组件的name属性，那么，devTools 工具中的组件树中会
  // 以name属性为准，来显示组件名称
  name: 'UserList',

  data () {
    return {
      // 用户列表数据
      userList: [],
      // 每页条数：
      pageSize: 2,
      // 总条数
      total: 0,
      // 搜索文本
      searchText: '',
      // 当前页
      // 用在 分页 组件中，如果是异步修改了 分页的total ，
      // 那么这个默认的当前页就不再生效，而是，默认选中第 1 页
      // 如果让默认选中页生效？ 在异步操作中，修改 curPage 的值即可
      curPage: 1,

      totalPage: 0,

      // 控制添加用户对话框的展示和隐藏
      userAddDialog: false,
      // 添加用户的数据对象
      userAddForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户的表单验证规则：
      userAddRules: {
        username: [
          { required: true, message: '用户名为必填项', trigger: 'blur' },
          { min: 4, max: 12, message: '用户名长度为：4-12个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码为必填项', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度为：6-12个字符', trigger: 'blur' }
        ]
      },

      // 控制编辑用户对话框的展示和隐藏
      userEditDialog: false,
      // 编辑用户的数据对象
      userEditForm: {
        username: '',
        email: '',
        mobile: '',
        id: -1
      },
      // 编辑用户的表单验证
      userEditRules: {},

      // 控制分配角色对话框展示和隐藏
      userAssignDialog: false,
      // 分配角色的数据
      userAssignForm: {
        // 当前用户的名称
        username: '',
        // 默认选中角色的id值
        roleId: -1,
        // 用户id
        userId: -1
      },

      /* options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }], */
      rolesList: []
    }
  },

  // 因为进入页面，就要展示数据，因此，在该钩子函数中发送请求获取数据
  created () {
    this.getUserList()

    // 获取角色列表
    this.getRoleLis()
  },

  methods: {
    /**
     * 发送请求，获取用户列表数据
     * @param {number} curPage 当前页
     */
    async getUserList (curPage = 1, searchText = '') {
      // 参数
      const params = {
        params: {
          // 查询条件
          query: searchText,
          // 当前页
          pagenum: curPage,
          // 每页大小
          pagesize: this.pageSize
        }
      }

      const res = await this.$http.get('/users', params)

      // ES6 中的对象解构语法：
      const { meta, data } = res.data
      // const status = meta.status
      const { status } = meta
      const { users, total } = data

      if (status === 200) {
        // 获取数据成功
        this.userList = users
        this.total = total
      }
    },

    /**
     * 分页获取用户列表数据
     * @param {number} curPage 当前页
     */
    getCurPageUserList (curPage) {
      this.curPage = curPage
      this.getUserList(curPage, this.searchText)
    },

    /**
     * 搜索
     */
    search () {
      // 点击搜索，将 curPage 设置为1
      // 那么，分页组件中的 current-page 就会自动变为1，也就是：第一页会自动选中
      this.curPage = 1
      this.getUserList(this.curPage, this.searchText)
    },

    /**
     * 修改用户的状态
     * @param {object} user 要修改的用户对象信息，包含了：id 和 mg_state
     */
    changeUserState (user) {
      // console.log('当前状态为：', user)

      // 接口地址为：users/:uId/state/:type
      // uId	用户 ID	不能为空携带在url中
      // type	用户状态	不能为空携带在url中，值为 true 或者 false
      // const url = '/users/' + user.id + '/state/' + user.mg_state
      const url = `/users/${user.id}/state/${user.mg_state}`

      // put方法的参数：
      // 第一个参数：url接口地址
      // 第二个参数：当前接口的参数，如果没有，就传递null
      // 第三个参数：接口的配置对象，用来配置 headers
      // axios
      // this.$http
      //   .put(url, null, {
      //     headers: {
      //       Authorization: localStorage.getItem('token')
      //     }
      //   })
      this.$http
        .put(url)
        .then(res => {
          // console.log('修改成功：', res)
          const { meta, data } = res.data
          if (meta.status === 200) {
            this.$message({
              // message: (data.mg_state === 1 ? '启用' : '禁用') + '成功',
              message: `${data.mg_state === 1 ? '启用' : '禁用'}成功`,
              type: 'success',
              duration: 500
            })
          } else {
            this.$message({
              message: '操作失败',
              type: 'error'
            })
          }
        })
    },

    /**
     * 展示添加用户对话框
     */
    showUserAddDialog () {
      // console.log('addUser')

      // 让对话框显示出来
      this.userAddDialog = true
    },

    /**
     * 添加用户
     */
    addUser () {
      // 添加表单验证
      this.$refs.userAddForm.validate((valid) => {
        if (valid) {
          // 成功
          this.$http
            .post('/users', this.userAddForm)
            .then(res => {
              const { meta } = res.data

              if (meta.status === 201) {
                // 成功
                // 1 关闭对话框
                this.userAddDialog = false
                // 2 刷新用户列表数据，为了看到最新添加的数据
                /*
                  比如：现在有10条数据，每页大小为2，那么做多有5页，如果设置为比5大的值，无效，也就是设置为 6 无效

                  但是，如果现将总条数 += 1，总条数就变为 11，变为11后，此时，一共6页，
                  再设置为 6，就会生效了
                */
                this.total += 1
                this.curPage = Math.ceil((this.total + 1) / this.pageSize)
                this.getUserList(this.curPage)
                // 3 清空表单内容
                this.$refs.userAddForm.resetFields()
              } else if (meta.status === 400) {
                this.$message({
                  message: meta.msg,
                  type: 'error'
                })
              }
            })
        } else {
          // 失败
          return false
        }
      })
    },

    /**
     * 展示编辑用户对话框
     * @param {object} user 编辑用户信息
     */
    showUserEditDialog (user) {
      // console.log('showUserEditDialog', user)
      this.userEditDialog = true

      // 设置编辑用户对话框中的数据
      this.userEditForm.username = user.username
      this.userEditForm.email = user.email
      this.userEditForm.mobile = user.mobile
      this.userEditForm.id = user.id
    },

    /**
     * 编辑用户
     */
    editUser () {
      const { id, email, mobile } = this.userEditForm

      this.$http
        // .put('/users/' + id, {
        // 使用 ES6中的字符串模板拼接字符串的功能：
        .put(`/users/${id}`, {
          email,
          mobile
        })
        .then(res => {
          // console.log('编辑用户', res.data)

          const { meta } = res.data

          if (meta.status === 200) {
            // 成功
            // 1 隐藏对话框
            this.userEditDialog = false
            // 2 刷新列表数据
            this.getUserList(this.curPage)
          }
        })
    },

    /**
     * 根据id删除用户
     * @param {number} id 要删除用户的id
     */
    delUser (id) {
      // 添加确认提示
      this.$confirm('您是否确定删除该用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求，删除用户
        this.$http
          .delete(`/users/${id}`)
          .then(res => {
            const { meta } = res.data

            if (meta.status === 200) {
              // 1 刷新列表数据
              this.getUserList(this.curPage)

              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 展示给用户分配角色对话框
    async showUserAssignDialog (user) {
      // 展示对话框
      this.userAssignDialog = true

      // 给分配角色数据赋值
      this.userAssignForm.username = user.username
      // 暂存用户id
      this.userAssignForm.userId = user.id
      // 选中默认角色
      // 根据当前用户的id，获取用的角色id
      const res = await this.$http.get(`users/${user.id}`)

      const { meta, data } = res.data
      if (meta.status === 200) {
        // 设置当前用户具有的角色id
        this.userAssignForm.roleId = data.rid

        // 没有角色情况下，进行特殊处理，什么不选中
        if (data.rid === -1) {
          this.userAssignForm.roleId = ''
        }
      }
    },

    // 获取角色列表
    async getRoleLis () {
      const res = await this.$http.get('/roles')

      // console.log(res)
      const { meta, data } = res.data
      if (meta.status === 200) {
        this.rolesList = data
      }
    },

    // 给用户分配角色
    async assignRole2User () {
      // 1 拿到用户id 和 角色id
      //  直接从 userAssignForm 中获取
      const { userId, roleId } = this.userAssignForm

      // 2 发送请求
      const res = await this.$http.put(`users/${userId}/role`, {
        rid: roleId
      })

      const { meta } = res.data
      if (meta.status === 200) {
        // 关闭对话框
        this.userAssignDialog = false
        // 重新刷新列表
        this.getUserList(this.curPage)
      }
    }
  }
}
