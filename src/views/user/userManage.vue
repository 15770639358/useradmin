<template>
  <div>
    <el-row  :gutter="20">
      <el-col :span="8">
        <el-input v-model="username"  placeholder="请输入用户名"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="success" @click="addUser">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="userInfo"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-table
              :data="props.row.roles"
              style="width: 100%;margin-bottom: 20px;"
              row-key="id"
              border
              :tree-props="{children: 'child'}">
              <el-table-column
                prop="name"
                label="角色名"
                sortable
                width="180">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteRole(scope.row,props.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="用户ID"
        prop="id">
      </el-table-column>
      <el-table-column
        label="用户名"
        prop="username">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            @click="needAddUser=scope.row.id;showUpdatePass=true">修改密码</el-button>
          <el-button
            size="mini"
            type="success"
            @click="addUserRole(scope.row)">添加角色</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteRole(scope.row,props.row.id)">删除用户</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加用户角色" :visible.sync="dialogTableVisible">
<!--        <el-cascader-->
<!--          v-model="showRoles"-->
<!--          ref = 'cascader'-->
<!--          @change = 'selectRole'-->
<!--          :options="showRoles"-->
<!--          :props="{ checkStrictly: true, label:'rolename', children:'child', value:'id', emitPath:false}"-->
<!--          :show-all-levels="false"-->
<!--          clearable></el-cascader>-->
      <el-form ref="form" :model="from" label-width="80px">
        <el-form-item label="活动区域">
          <el-select v-model="from.addRole" placeholder="请选择要添加的角色">
            <el-option v-for="item in showRoles" :label="item.rolename" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="canalAddRole">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改密码" :visible.sync="showUpdatePass">
      <el-form ref="form" :model="from" label-width="80px">
        <el-input v-model="from.updatePassword" placeholder="请输入密码" show-password></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="needAddUser='';from.updatePassword='';showUpdatePass=false">取 消</el-button>
        <el-button type="primary" @click="updatePass">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getAllUser, removeUserRole,getUserRole, addUserRole, getCountUser, addUser, updatePassword} from '../../api/user'
import {getAllRoleByList} from '../../api/role'
import md5 from  'js-md5'
export default {
  name: 'userManage',
  data() {
    return {
      showUpdatePass:false,
      username: '',//新添加的用户名
      showRoles: [], //展示的权限信息 连级
      from: {
        addRole: '', //选中角色的id'
        updatePassword: '' //修改密码
      },
      userInfo: [], // 所有用户信息
      allRoles: [], //所有角色信息

      needAddUser: '',//添加角色者的id
      dialogTableVisible: false
    }
  },
  async mounted()  {
   this.init()
  },
  methods: {
    async init() {
      const userInfo = await getAllUser()
      this.userInfo = userInfo.data
      const allRoles = await getAllRoleByList()
      this.allRoles = allRoles.data
    },
    //添加角色
    async addUserRole(user) {
      this.needAddUser = user.id
      // this.copyAllRoles()
      this.showRoles = []
      let {data} = await getUserRole({userId:user.id})
      let rolesId = []
      data.forEach(roles => {
        rolesId.push(roles.roleId)
      })
      this.notSelectRole(this.allRoles, rolesId)
      this.dialogTableVisible = true
      // setTimeout(() => {console.log(this.$refs.cascader);},100)
    },

    //判断已有角色禁止选择
    notSelectRole(allroles,rolesId) {
      allroles.forEach(role => {
        if(!rolesId.includes(role.id)){
          this.showRoles.push(role)
        }
        if(role.child){
          this.notSelectRole(role.child,rolesId)
        }
      })
    },
    async addRoles() {
      let data = await addUserRole({userId: this.needAddUser, roleId: this.from.addRole})
      if(data.code === 0){
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        this.needAddUser = ''
        this.addRole = ''
        this.from.addRole = ''
        this.showRoles = []
        await this.init()
        this.dialogTableVisible = false
      }else {
        this.$message({
          type: 'error',
          message: '添加失败!'
        })
      }
    },
    async canalAddRole() {
      this.needAddUser = ''
      this.addRole = ''
      this.from.addRole = ''
      this.showRoles = []
      this.dialogTableVisible = false
    },
    //删除角色
    async deleteRole(auth,id) {
      let data = await removeUserRole({userId:id,roleId:auth.id})
      if(data.code === 0){
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        await this.init()
      }else {
        this.$message({
          type: 'error',
          message: '删除失败!'
        })
      }
    },
    //选择角色
    selectRole(e) {
      this.addRole = e
    },
    async addUser() {
      let username = this.username
      let {data} = await getCountUser({username})
      if(data[0].count > 0 ){
        this.$message({
          type: 'error',
          message: '添加失败!已存在该用户名'
        })
        return
      }else if(!username.trim()){
        this.$message({
          type: 'error',
          message: '添加失败!用户名不可为空'
        })
        return
      }else {
        let {code} = await addUser({username: this.username})
        if(code === 0){
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.username = ''
          await this.init()
        }
      }
    },
    //修改密码
    async updatePass() {
      let pass = this.from.updatePassword
      let userId = this.needAddUser
      console.log(pass);
      console.log(userId);
      //updatePassword
      if(pass.trim().length <6){
        this.$message({
          type: 'error',
          message: '修改失败!密码长度不可少于6位'
        })
        return
      }else {
        let {code} = await updatePassword({userId: userId,password: md5(pass)})
        console.log(code);
        if(code === 0){
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }
      }
      this.needAddUser = ''
      this.from.updatePassword = ''
      this.showUpdatePass = false
    }
  }
}
</script>

<style scoped>
.el-row{
  padding: 10px 0 10px 10px;
}
</style>

