<template>
    <div>
        <el-table
            :data="userInfo"
            stripe
            style="width: 100%">
                <el-table-column
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
  </el-table>
    </div>
</template>

<script>
import {getAllUser} from '../../api/user'
export default {
    name: 'PageUser',
    data() {
        return {
            userInfo: []
        }
    },
    async mounted()  {
        const users = await getAllUser()
        this.userInfo = users.data
    },
}
</script>
