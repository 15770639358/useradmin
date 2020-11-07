<template>
  <div>
    <el-table
      border
      :data="userInfo"
      stripe
      style="width: 100%"
      :default-sort = "{prop: 'username', order: 'ascending'}">
      <el-table-column
        sortable
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        empty-text = ''
        prop="roles[0].name"
        label="角色名1">
      </el-table-column>
      <el-table-column
        empty-text = ''
        prop="roles[1].name"
        label="角色名2">
      </el-table-column>
      <el-table-column
        empty-text = ''
        prop="roles[2].name"
        label="角色名3">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="showRoleEditor(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.roles)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="角色编辑" :visible.sync="dialogVisible">
      <el-form :model="selectRole">
        <el-form-item label="角色选择">
          <el-checkbox-group v-model="selectRole.id" :min="1">
            <el-checkbox :label="1" :disabled='!$store.state.user.roles.includes("admin")'>admin</el-checkbox>
            <el-checkbox :label="2">editor</el-checkbox>
            <el-checkbox :label="3">reader</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editorRole">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {getAllUser} from '../../api/user'
import {getRoleId} from '../../api/role'
import {addRole} from '../../api/role'
import {removeRole} from '../../api/role'
export default {
  name: 'PageUser',
  data() {
    return {
      userInfo: [], //所有用户与角色信息
      selectRole: {
        id: [],
      }, //选择角色的id
      editorId: '', //编辑者的id
      dialogVisible: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const users = await getAllUser()
      this.userInfo = users.data
    },
    showRoleEditor(user) {
      let roles = user.roles
      this.selectRole.id = []
      this.editorId = user.id
      roles.forEach(role => {
        this.selectRole.id.push(role.id)
      })
      this.dialogVisible = true
    },
    async editorRole() {
      let userId = this.editorId
      let beforeRole = await getRoleId({id:userId})
      beforeRole = beforeRole.data.roleId
      for(let id of this.selectRole.id) {
        if(!beforeRole.includes(id)) {
          //添加role
          let data = await addRole({userId, roleId: id})
        }
      }
      for(let id of beforeRole){
        if(!this.selectRole.id.includes(id)) {
          //添加role
          let data = await removeRole({userId, roleId: id})
        }
      }
      this.init()
      this.dialogVisible = false
    }
  }
}
</script>
