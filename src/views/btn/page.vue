<template>
  <div>
    <el-button type="primary" v-if="hasPerm('btn/page/addRole')">权限测试增加按钮</el-button>
    <el-button type="success" v-if="hasPerm('btn/page/removeRole')">权限测试删除按钮</el-button>
    <el-button type="info" v-if="hasPerm('btn/page/readRole')">权限测试阅读按钮</el-button>
  </div>
</template>

<script>
export default {
  name: "PageBtn"
}
</script>

<style scoped>

</style>
