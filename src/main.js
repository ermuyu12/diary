import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Lazyload from "vue3-lazyload";
import '@/style/reset.css'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(Lazyload, {
  loading: "/src/assets/loading.png",//可以指定加载中的图像
  error: "/src/assets/error.png",//可以指定加载失败的图像
});

app.mount('#app')
