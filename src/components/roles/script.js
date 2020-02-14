export default {
  name: 'Roles',

  data () {
    return {
      rolesList: [],

      // 控制修改对话框的展示和隐藏
      roleEditDialog: false,
      // 修改角色数据
      roleEditForm: {
        roleName: '',
        roleDesc: '',
        id: -1
      },

      // 分配权限
      assignRightsDialog: false,

      // 树形权限数据
      rightsTreeData: [],

      /* data2: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1'
            },
            {
              id: 6,
              label: '二级 2-2'
            }]
        },
        {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }], */

      defaultProps: {
        // 通过哪个对象来表示当前节点的子节点
        // children: 'children',
        // 指定页面中节点名称使用数据中的哪个属性
        label: 'authName'
      },

      // 当前选中角色id
      curSelectedRoleId: -1
    }
  },

  created () {
    this.getRolesList()
  },

  methods: {
    // 获取角色列表
    async getRolesList () {
      // 步骤：
      // 1 根据接口文档获取到数据
      //  地址、请求类型、参数
      // 2 将数据交给 rolesList
      const res = await this.$http.get('/roles')

      const { meta, data } = res.data
      if (meta.status === 200) {
        this.rolesList = data
      }
    },

    // 处理索引号的方法
    indexMethod (index) {
      return index
    },

    /**
     * 根据id删除角色
     * @param {number} id 要删除角色的id
     */
    delRole (id) {
      this.$confirm('您确认删除该角色吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delRoleById(id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    async delRoleById (id) {
      // 确认删除
      // 步骤：
      // 1 找到删除按钮，绑定单击事件
      // 2 在事件中将id作为参数传递过来
      // 3 根据接口文档，获取到删除角色接口的 地址、请求类型、参数
      // 4 发送请求，删除角色
      const res = await this.$http.delete(`/roles/${id}`)

      // console.log(res)
      // 5 重新渲染列表
      const { meta } = res.data
      if (meta.status === 200) {
        this.getRolesList()

        // 提示
        this.$message({
          type: 'success',
          message: meta.msg
        })
      }
    },

    /**
     * 展示修改角色对话框
     */
    showRoleEditDialog (role) {
      // 展示修改对话框
      this.roleEditDialog = true

      // 从页面中获取到当前修改的角色数据：
      this.roleEditForm.roleName = role.roleName
      this.roleEditForm.roleDesc = role.roleDesc
      this.roleEditForm.id = role.id
    },

    // 修改角色信息
    async editRole () {
      const { id, roleName, roleDesc } = this.roleEditForm

      // 1 发送请求
      const res = await this.$http.put(`roles/${id}`, {
        roleName,
        roleDesc
      })
      // 2 重新刷新列表

      const { meta } = res.data
      if (meta.status === 200) {
        // 关闭对话框
        this.roleEditDialog = false
        // 刷新列表
        this.getRolesList()
      }
    },

    // 展示分配权限对话框
    showAssignRightsDialog (role) {
      // 存储当前要分配权限的角色id
      this.curSelectedRoleId = role.id

      // 点击分配权限按钮，获取所有的权限数据
      // 判断 rightsTreeData 是否有数据，如果有了，就不要重复再次获取了
      this.getAllRights(role)
      /* if (this.rightsTreeData.length === 0) {
        this.getAllRights()
      } else {
        this.assignRightsDialog = true
      } */
    },

    // 获取到全部权限列表
    async getAllRights (role) {
      // 步骤：
      // 1 发送请求
      const res = await this.$http.get('rights/tree')
      // 2 将获取到的数据交给 rightsTreeData
      // console.log(res)

      const { meta, data } = res.data
      if (meta.status === 200) {
        this.rightsTreeData = data

        // 获取到数据后,再展示对话框
        this.assignRightsDialog = true

        this.$nextTick(() => {
          // 根据当前角色的权限, 进行默认选中功能
          // 根据分析，只需要获取到三级菜单选中，那么，二级以及一级菜单，都会默认的选中处理

          // 遍历三级菜单，获取到当前角色已经拥有的权限
          const level3Ids = []
          role.children.forEach(level1 => {
            level1.children.forEach(level2 => {
              level2.children.forEach(level3 => {
                level3Ids.push(level3.id)
              })
            })
          })

          // 设置默认选中
          this.$refs.rightsTree.setCheckedKeys(level3Ids)
        })
      }
    },

    // 设置角色权限
    async setRoleRights () {
      // 1 获取到tree中选中的节点信息
      // console.log(this.$refs.rightsTree.getCheckedKeys())
      // console.log(this.$refs.rightsTree.getHalfCheckedKeys())
      const checkedRights = this.$refs.rightsTree.getCheckedKeys()
      const checkedHalfRights = this.$refs.rightsTree.getHalfCheckedKeys()
      // 当前选中的所有权限id数组
      // const allCheckedRights = checkedRights.concat(checkedHalfRights)
      const allCheckedRights = [...checkedRights, ...checkedHalfRights]

      // 2 根据接口文档，发送请求，更新该角色的权限信息
      const res = await this.$http.post(`/roles/${this.curSelectedRoleId}/rights`, {
        rids: allCheckedRights.join(',')
      })

      // console.log(res)
      // 3 关闭对话框，刷新列表数据
      const { meta } = res.data

      if (meta.status === 200) {
        // 关闭对话框
        this.assignRightsDialog = false
        // 刷新列表数据
        this.getRolesList()
      }
    }
  }
}
