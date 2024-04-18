<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ref, reactive, nextTick } from 'vue'
import { getCodeBase } from '@/api/code'
import { loginApi, registerApi } from '@/api/user'
import { setInfo } from '@/utils/storage'
import { type FormProps, type FormInstance, type FormRules } from 'element-plus'
const labelPosition = ref<FormProps['labelPosition']>('top')


const router = useRouter()

const formLabelAlign = ref({
  username: '',
  password: '',
  code: '',
  authType: '',
})

// 图形验证码
const codeBase = ref('')
// 控制获取验证码按钮的可用状态
const canGetCaptcha = ref(false)
const img = ref(null)
const getCode = async () => {
  const res = await getCodeBase(formLabelAlign.value.username)
  codeBase.value = res.data
  img.value.style.display = 'block'
  ElMessage.success(res.msg)
}

// 表单校验
interface RuleForm {
  username: string
  password: string
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  username: '',
  password: '',
})

const rules = reactive<FormRules<RuleForm>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/, message: '密码必须包含数字和字母，且长度为8-20位', trigger: 'blur' },
  ]
})

// 登录
const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 判断是否需要开启验证码
      if (!canGetCaptcha.value) {
        // 开启验证码按钮
        canGetCaptcha.value = true
        isShowImg.value = false
        return
      }
      // 判断验证码是否获取
      if (codeBase.value === '') {
        ElMessage.error('请获取验证码!')
        return
      }
      formLabelAlign.value.authType = 'password'
      // 发送登录请求
      loginApi(formLabelAlign.value.username, formLabelAlign.value.password, formLabelAlign.value.code, formLabelAlign.value.authType).then((res) => {
        if (res.code === 200) {
          formLabelAlign.value = {
            username: '',
            password: '',
            code: '',
            authType: ''
          }
          img.value.style.display = 'none'
          codeBase.value = ''
          // isShowImg.value = true
          setInfo(res.data)
          ElMessage.success(res.msg)
          router.push('/layout')
        } else {
          console.log('error submit!', fields)
        }
      })
    }

  })
}
// 注册
const register = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 判断是否需要开启验证码
      if (!canGetCaptcha.value) {
        // 开启验证码按钮
        canGetCaptcha.value = true
        // isShowImg.value = false
        return
      }
      // 判断验证码是否获取
      if (codeBase.value === '') {
        ElMessage.error('请获取验证码!')
        return
      }
      // 发送注册请求
      registerApi(formLabelAlign.value).then((res) => {
        if (res.code === 200) {
          formLabelAlign.value.code = ''
          img.value.style.display = 'none'
          codeBase.value = ''
          isShowImg.value = true
          ElMessage.success(res.msg)
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

// const isShowImg = ref(true)
// const dialogVisible = ref(false)

// const wxLogin = () => {
//   dialogVisible.value = true
// }

// const handleDialogOpened = () => {
//   nextTick(() => {
//     //然后将传参直接实例化到JS对象中
//     const obj = new WxLogin({
//       self_redirect: true,
//       id: "login_container",
//       appid: "wxed9954c01bb89b47",
//       scope: "snsapi_login",
//       redirect_uri: "http://localhost:8160/wxLogin",
//       state: "",
//       style: "",
//       href: ""
//     })
//   })
// }

// const handleDialogClosed = () => {
//   dialogVisible.value = false;
// }

// const GetQueryString = (name) => {
//   const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//   const r = window.location.search.substr(1).match(reg);
//   if (r != null) return decodeURI(r[2]);
//   return null;
// }

// const username = ref('')
// const authType = ref('')

// username.value = GetQueryString("username");
// authType.value = GetQueryString("authType");
// console.log(username, authType);

// if (username && authType && authType == 'wx') {
//   formLabelAlign.value.username = username;
//   formLabelAlign.value.authType = authType;
//   loginApi(formLabelAlign.value.username, formLabelAlign.value.authType).then((res) => {
//     if (res.code === 200) {
//       setInfo(res.data)
//       ElMessage.success(res.msg)
//       window.location.href = '/layout'
//     }
//   })
// }
</script>

<template>
  <div class="app">
    <div class="bg">
      <img v-lazy="'/src/assets/bg.png'" alt="" style="width: 100%;height: 100%;">
    </div>
    <div class="login" v-show="!isShow">
      <el-form class="el-login" ref="ruleFormRef" :rules="rules" :model="formLabelAlign" :label-position="labelPosition"
        label-width="auto" style="width: 280px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formLabelAlign.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input show-password v-model="formLabelAlign.password" />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="formLabelAlign.code" />
        </el-form-item>
        <el-form-item>
          <img ref="img" style="display: none;" :src="'data:image/png;base64,' + codeBase" />
          <el-button :disabled="!canGetCaptcha" type="success" @click="getCode">获取验证码</el-button>
          <!-- <img v-show="isShowImg" src="@/assets/wx.png" style="width: 40px; height: 40px;" @click="wxLogin"> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 280px" @click="login(ruleFormRef)">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 280px" @click="register(ruleFormRef)">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- <el-dialog v-model="dialogVisible" @opened="handleDialogOpened" @closed="handleDialogClosed">
    <div id="login_container"></div>
  </el-dialog> -->
  </div>
</template>

<style scoped lang="less">
#login_container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

bg::-webkit-scrollbar {
  display: none
}

.bg {
  height: 100vh;
  width: 50%;
  float: left;
  background-repeat: no-repeat;
  background-size: 100% 100%;

}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 50%;
  float: right;

  .el-login {
    border: 1px solid transparent;
    border-radius: 15px;
    padding-right: 30px;
    /* 为其整体设置接近透明的效果*/
    background-color: rgba(255, 255, 255, 0.1);
    /* 设置box-shadow使其有立体感 */
    box-shadow: 5px 5px 0 0 rgba(0, 0, 0, 0.2);
  }

  /deep/ .el-form-item__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
