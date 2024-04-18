<script setup>
import { logoutApi } from '@/api/user'
import { useRouter } from 'vue-router'
import { removeInfo } from '@/utils/storage'

const router = useRouter()

// 退出登陆
const logout = () => {
  logoutApi().then(res => {
    if (res.code === 200) {
      // 清除token
      removeInfo()
      ElMessage.success(res.msg)
      // 跳转到登陆页
      router.push('/login')
    }
  })
}

</script>

<template>
  <div>
    <el-button type="primary" @click="logout">退出登陆</el-button>
  </div>
</template>


<style lang="less" scoped></style>