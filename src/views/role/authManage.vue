<template>
  <div>
    <el-table
      :data="roles"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{children: 'child'}">
      <el-table-column
        prop="id"
        label="id"
        width="180">
      </el-table-column>
      <el-table-column
        prop="rolename"
        label="角色名">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="editRoleAuth(scope.row)" :disabled="scope.row.id === 1">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog
      title="权限信息"
      :visible.sync="dialogVisible"
      width="30%">
      <el-tree
        ref="tree"
        :data="allAuths"
        show-checkbox
        node-key="id"
        :default-expanded-keys="parentNodes"
        :default-checked-keys="leftNodes"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRoleAuths">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {getAllRoles, getAuthByRoleId, getAllAuths, addAuth, removeAuth, getAllRoleByList } from '../../api/role'
export default {
  name: "pageRole",
  data() {
    return {
      dialogVisible: false,
      roleId: '',//权限者的id
      roleAuthsId: [], //选择角色已有权限的id集合
      roles: [], // 所有角色
      allAuths: [], //所有权限信息
      leftNodes: [], //选择角色已有权限的id叶子节点
      parentNodes: [], //选择角色已有权限的id父节点
      defaultProps: {
        children: 'child',
        label: 'authname'
      }
    }
  },
  async mounted() {
    await this.init()
  },

  methods: {
    async init() {
      let {data} = await getAllRoleByList()
      let allAuths = await getAllAuths()
      this.allAuths = allAuths.data
      this.roles = data
    },

    async editRoleAuth(auth) {
      this.roleAuthsId = []
      this.leftNodes = []
      this.parentNodes = []
      let id = auth.id
      this.roleId = id
      let {data} = await getAuthByRoleId({id})
      this.getRoleAuthsId(data)
      this.setRoleAuthsId(this.allAuths)
      this.dialogVisible = true
      setTimeout(() => {this.$refs.tree.setCheckedKeys(this.leftNodes);},30)
    },

    updateRoleAuths() {
      let updateAuth = [...this.$refs.tree.getCheckedKeys(),...this.$refs.tree.getHalfCheckedKeys()]
      this.roleAuthsId.forEach(async id => {
        if(!updateAuth.includes(id)){
          await removeAuth({roleId: this.roleId, authId: id})
        }
      })
      updateAuth.forEach(async id => {
        if(!this.roleAuthsId.includes(id)){
          await addAuth({roleId: this.roleId, authId: id})

        }
      })
      this.$message({
        type:"success",
        message: '编辑成功'
      })
      this.dialogVisible = false
    },
    getRoleAuthsId (roleAuths) {
      roleAuths.forEach(roleAuth => {
        this.roleAuthsId.push(roleAuth.id)
        if(roleAuth.child){
          this.getRoleAuthsId(roleAuth.child)
        }
      })
    },
    setRoleAuthsId(allAuths) {
      allAuths.forEach(allAuth => {
        if(allAuth.child){
          if(this.roleAuthsId.includes(allAuth.id)){
            this.parentNodes.push(allAuth.id)
          }
          this.setRoleAuthsId(allAuth.child)
        }else {
          if(this.roleAuthsId.includes(allAuth.id)){
            this.leftNodes.push(allAuth.id)
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
