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
            @click="dialogFormVisible = true; addRolename = ''; parentRole = scope.row">添加子角色</el-button>
          <el-button
            :disabled = 'scope.row.id === 1'
            size="mini"
            type="danger"
            @click="deleteRole(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

<!--    添加角色-->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
      <el-input v-model="addRolename" placeholder="请输入角色名"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false; addRolename = '', parentRole = ''">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getAllRoleByList, addRoles, removeRoles} from '../../api/role'

export default {
  name: 'PageUser',
  data() {
    return {
      dialogFormVisible: false,
      roles: [], //所有角色信息
      addRolename: '', //要添加的角色名
      parentRole: '' //要添加子角色的父角色信息
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init () {
      let roles = await getAllRoleByList()
      this.roles = roles.data
      console.log(this.roles);
    },

    async addRole () {
      let category = this.parentRole.category
      if(this.addRolename.trim()){
        let data = await addRoles({category, rolename: this.addRolename})
        if(data.code === 0) {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.addRolename = ''
          this. parentRole = ''
          this.dialogFormVisible = false
          await this.init()
        }
      }else {
        this.$message({
          type: 'error',
          message: '请输入角色名'
        })
      }
    },

    //删除角色
    async deleteRole(role) {
      this.$confirm('此操作将永久删除该角色及其所有子角色, 是否继续?', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let data = await removeRoles({category: role.category})
        if(data.code === 0) {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.init()
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>
