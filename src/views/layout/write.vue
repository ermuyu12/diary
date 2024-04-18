<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'
import { ref, reactive, nextTick } from 'vue'
import { type FormProps, type FormRules } from 'element-plus'
import { addDiaryAPI, getDiaryAPI, getDiaryByIdAPI, updateDiaryAPI } from '@/api/diary'

const labelPosition = ref<FormProps['labelPosition']>('top')
const queryTitle = ref(null)
const queryTime = ref(null)
const title = ref('')
const dialogVisible = ref(false)
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

// 表单校验
interface RuleForm {
  title: string
  date: string
  content: string
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  title: '',
  date: '',
  content: '',
})

const rules = reactive<FormRules<RuleForm>>({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
  ],
  date: [
    { required: true, message: '请选择时间', trigger: 'change' },
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
  ]
})

const queryParams = ref({
  currentPage: pagination.value.currentPage,
  pageSize: pagination.value.pageSize,
  queryTitle: queryTitle.value,
  queryTime: queryTime.value
})

const getDiatyList = () => {
  queryParams.value.currentPage = pagination.value.currentPage
  queryParams.value.pageSize = pagination.value.pageSize
  queryParams.value.queryTitle = queryTitle.value
  queryParams.value.queryTime = queryTime.value
  getDiaryAPI(queryParams.value).then(res => {
    diaries.value = res.data.records
    pagination.value.total = res.data.total
  })
}

const handleSizeChange = (size) => {
  pagination.value.pageSize = size;
  getDiatyList();
};

const handleCurrentChange = (page) => {
  pagination.value.currentPage = page;
  getDiatyList();
};

const query = () => {
  pagination.value.currentPage = 1; // Reset to the first page
  getDiatyList();
};

getDiatyList();

const form = ref({
  id: null,
  title: '',
  date: '',
  content: '',
})

const clean = () => {
  form.value = {
    id: null,
    title: '',
    date: '',
    content: '',
  }
}

const open = () => {
  clean()
  dialogVisible.value = true
  title.value = '编写日记'
}

const handleOpeenCardDialog = () => {
  nextTick(() => {
    // 清空校验
    ruleFormRef.value.clearValidate()
  })
}

const handleClose = (done: () => void) => {
  done()
}

const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 判断是新增提交还是修改提交
      if (form.value.id === null) {
        // 新增提交
        dialogVisible.value = false
        addDiaryAPI(form.value).then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.msg)
          }
          clean()
          getDiatyList();
        })
      } else {
        // 修改提交
        dialogVisible.value = false
        updateDiaryAPI(form.value).then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.msg)
          }
          clean()
          getDiatyList();
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const diaries = ref([
])
const formatDate = (date: string) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}

const update = (diaryId) => {
  clean()
  dialogVisible.value = true
  title.value = '编辑日记'
  getDiaryByIdAPI(diaryId).then((res) => {
    form.value = res.data
  })
}
</script>

<template>
  <div class="top">
    <div class="add-icon">
      <el-button :icon="Plus" @click="open()" />
    </div>
    <el-input clearable v-model="queryTitle" style="width: 240px" placeholder="请输入标题" />
    <div class="block">
      <el-date-picker v-model="queryTime" type="daterange" range-separator="To" start-placeholder="开始时间"
        end-placeholder="截止时间" />
    </div>
    <el-button type="primary" @click="query">查询</el-button>
  </div>
  <!-- 弹出框 -->
  <el-dialog @open="handleOpeenCardDialog" v-model="dialogVisible" :title="title" :before-close="handleClose"
    width="700">
    <!-- 表单 -->
    <el-form ref="ruleFormRef" :rules="rules" :model="form" label-width="auto" style="max-width: 700px"
      :label-position="labelPosition">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="时间" prop="date">
        <el-date-picker v-model="form.date" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" placeholder="请选择时间" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input :rows="4" v-model="form.content" type="textarea" style="height: 100px;" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="submit(ruleFormRef)">
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 日记列表 -->
  <div class="diary-app">
    <ul class="diary-list">
      <li @click="update(diary.id)" v-for="(diary, index) in diaries" :key="index" class="diary-item">
        <div class="diary-header">
          <h2>{{ diary.title }}</h2>
          <p class="diary-date">{{ formatDate(diary.date) }}</p>
        </div>
        <div class="diary-content">{{ diary.content }}</div>
      </li>
    </ul>
  </div>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
    :current-page="pagination.currentPage" :page-sizes="[10, 15, 20, 25]" :page-size="pagination.pageSize"
    layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
  </el-pagination>
</template>

<style lang="less" scoped>
.top {
  display: flex;
  width: 80%;
  justify-content: space-around;
  margin: 0 auto;
}

.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}

.demo-date-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}

.demo-pagination-block+.demo-pagination-block {
  margin-top: 10px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}

.el-pagination {
  display: flex;
  justify-content: center;
}

/* Reset some basic elements */
body,
h1,
h2,
p,
ul,
li {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

ul,
li {
  list-style-type: none;
}

.diary-app {
  font-family: Arial, sans-serif;
  /* 使用您喜欢的字体系列 */
  max-width: 960px;
  /* 可调整为您需要的最大宽度 */
  margin: 0 auto;
  /* 居中显示 */
  background-color: #f5f5f5;
  /* 轻微背景色以增加层次感 */
  padding: 2rem;
}

.diary-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  /* 自适应多列布局，最小宽度300px */
  gap: 2rem;
  /* 列间距 */
}

.diary-item {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
  /* 添加阴影效果 */
  overflow: hidden;
  transition: transform 0.2s ease-out;
  /* 添加平滑过渡效果 */
}

.diary-item:hover {
  transform: translateY(-0.2rem);
  /* 鼠标悬停时轻微上浮 */
}

.diary-header {
  padding: 1.5rem;
  background-color: #f0f0f0;
  /* 轻微背景色区分头部 */
  border-bottom: 1px solid #e0e0e0;
}

/* 更新：标题单行显示，超出部分以省略号替代 */
.diary-header h2 {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.diary-content {
  margin: 1.5rem;
  line-height: 1.6;
  /* 提高行间距，提升阅读体验 */
  color: #444;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 更新：日记内容显示前5行 */
.diary-content p:not(:last-child) {
  margin-bottom: 1rem;
  /* 段落间间距 */
}

.diary-date {
  font-size: 0.875rem;
  /* 修正此处为正确的单位：rem */
  color: #666;
  text-transform: uppercase;
  /* 将日期转换为大写 */
}
</style>