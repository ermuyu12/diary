<script setup>
import { EditPen, Operation, Delete, User, Star } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
const route = useRoute()
const currentPath = ref('');
onMounted(() => {
  activeMenuItem.value = route.path;
  currentPath.value = route.path; // 在组件挂载时设置当前路径
});

const activeMenuItem = ref('');
const activateMenuItem = (index) => {
  activeMenuItem.value = index;
};
</script>

<template>
  <div class="common-layout">
    <el-container style="height: 100vh;">
      <el-aside width="200px">
        <el-menu style="height: 100vh;" :default-active="currentPath" class="el-menu-vertical-demo" router>
          <el-menu-item class="top">
            <img style="width: 40px;height: 40px;margin-right: 10px;" src="@/assets/avatar.png" alt="avatar"
              class="avatar">
            耳目鱼笔记
          </el-menu-item>
          <el-menu-item @click="activateMenuItem('/write')" :class="{ 'active-border': activeMenuItem === '/write' }"
            index="/write" style="font-size: 16px;">
            <el-icon :size="22" style="margin-left: 20px;">
              <EditPen />
            </el-icon>
            <span>编写日记</span>
          </el-menu-item>
          <el-menu-item @click="activateMenuItem('/manage')" :class="{ 'active-border': activeMenuItem === '/manage' }"
            index="/manage" style="font-size: 16px;">
            <el-icon :size="22" style="margin-left: 20px;">
              <Operation />
            </el-icon>
            <span>管理日记</span>
          </el-menu-item>
          <!-- <el-menu-item index="/share">
            <el-icon>
              <Share />
            </el-icon>
            <span>我的分享</span>
          </el-menu-item> -->
          <el-menu-item @click="activateMenuItem('/receive')"
            :class="{ 'active-border': activeMenuItem === '/receive' }" index="/receive" style="font-size: 16px;">
            <el-icon :size="22" style="margin-left: 20px;">
              <Star />
            </el-icon>
            <span>收记站</span>
          </el-menu-item>
          <el-menu-item @click="activateMenuItem('/recycle')"
            :class="{ 'active-border': activeMenuItem === '/recycle' }" index="/recycle" style="font-size: 16px;">
            <el-icon :size="22" style="margin-left: 20px;">
              <Delete />
            </el-icon>
            <span>回收站</span>
          </el-menu-item>
          <el-menu-item @click="activateMenuItem('/user')" :class="{ 'active-border': activeMenuItem === '/user' }"
            index="/user" style="font-size: 16px;">
            <el-icon :size="22" style="margin-left: 20px;">
              <User />
            </el-icon>
            <span>个人中心</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.top {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.active-border {
  border-left: 4px solid #409eff;
}

.el-aside {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  line-height: 200px;
}

/deep/ .el-item-menu {
  font-size: 20px;
}

.el-menu-item:hover {
  background-color: #ffffff;
}

.el-main {
  background-color: #f5f5f5;
  color: #333;
}

body>.el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>