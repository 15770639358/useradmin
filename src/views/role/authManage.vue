<template>
  <div>
    <el-table
      :data="roles"
      style="width: 100%"
      row-key="id"
      border
      lazy
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
      // showAuths: [], //展示权限信息
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
      this.showAuths = this.allAuths
      let id = auth.id
      this.roleId = id
      let {data} = await getAuthByRoleId({id})
      // if((auth.category+'').length !== 2){
      //   let category = (auth.category+'').substring(0,(auth.category+'').length-2)
      //   let roleId = this.getParentRoleId(category,this.roles)
      //   let {data} = await getAuthByRoleId({id: roleId})
      //   this.showAuths = data
      // }
      this.getRoleAuthsId(data)
      this.setRoleAuthsId(this.allAuths)
      // this.init()
      this.dialogVisible = true
      setTimeout(() => {this.$refs.tree.setCheckedKeys(this.leftNodes);},30)
    },

    // 遍历roles拿取父id
    // getParentRoleId(category,roles){
    //   let roleId = ''
    //   for (const role of roles) {
    //     if((role.category+'') === category){
    //       roleId = role.id
    //       return role.id
    //     }
    //     if(role.child){
    //       roleId = this.getParentRoleId(category,role.child)
    //     }
    //   }
    //   return roleId
    // },
    //获取父角色的所有子角色
    // getChildRoles(parentId) {
    //   this.roles.forEach((role) => {
    //     if(role.id === parentId){
    //       this.getChildRoleId(role.child)
    //     }
    //     if(role.child){
    //       this.getChildRoles(role.child)
    //     }
    //   })
    // },
    //遍历roles拿取子id
    // getChildRoleId(roles){
    //   roles.forEach(role => {
    //     console.log(role.id,'aaaaa')
    //     if(role.child) {
    //       this.getChildRoleId(role.child)
    //     }
    //   })
    //
    // },
    updateRoleAuths() {
      let updateAuth = [...this.$refs.tree.getCheckedKeys(),...this.$refs.tree.getHalfCheckedKeys()]
      let data = ''
      this.roleAuthsId.forEach(async id => {
        if(!updateAuth.includes(id)){
          //删除，其所有子角色的响应权限也会删除
          // this.getChildRoles(this.roleId)
          data = await removeAuth({roleId: this.roleId, authId: id})
        }
      })
      updateAuth.forEach(async id => {
        if(!this.roleAuthsId.includes(id)){
          data = await addAuth({roleId: this.roleId, authId: id})
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
