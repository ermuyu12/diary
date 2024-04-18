<script setup>
import { onMounted } from 'vue';
onMounted(() => {
  const obj = new WxLogin({
    self_redirect: true,
    id: "login_container",
    appid: "wxed9954c01bb89b47",
    scope: "snsapi_login",
    redirect_uri: "http://localhost:8160/wxLogin",
    state: "",
    style: "",
    href: ""
  })
})
</script>

<template>
  <div>
    <div id="login_container"></div>
  </div>
</template>

<style lang="less" scoped>
#login_container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>