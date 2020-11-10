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
           @click="showRoleAuth(scope.row)">查看</el-button>
       </template>
     </el-table-column>
   </el-table>


   <el-dialog
     title="权限信息"
     :visible.sync="dialogVisible"
     width="30%">
     <el-tree :data="auths" :props="defaultProps" default-expand-all></el-tree>
     <div slot="footer" class="dialog-footer">
       <el-button @click="dialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
     </div>
   </el-dialog>

 </div>
</template>

<script>
import {getAllRoles, getAuthByRoleId, getAllRoleByList} from '../../api/role'
export default {
  name: "pageRole",
  data() {
    return {
      dialogVisible:false,
      roles: [],
      auths:[],
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
      this.roles = data
    },

    async showRoleAuth(auth) {
      this.auths = []
      let id = auth.id
      let {data} = await getAuthByRoleId({id})
      this.auths = data
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>

</style>
