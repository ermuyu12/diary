<script lang="ts" setup>
import { Share, Delete, User } from '@element-plus/icons-vue'
import { ref, reactive, nextTick } from 'vue'
import { type FormProps, type FormRules } from 'element-plus'
import { shareDiaryAPI, getDiaryAPI, getDiaryByIdAPI, falseDeleteDiaryAPI } from '@/api/diary'

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
  username: string
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  username: '',
})

const rules = reactive<FormRules<RuleForm>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
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

const shareForm = ref({
  id: null,
  username: '',
  type: '',
})

const clean = () => {
  shareForm.value = {
    id: null,
    username: '',
    type: '',
  }
}

const handleOpeenCardDialog = () => {
  nextTick(() => {
    // 清空校验
    ruleFormRef.value.clearValidate()
  })
}

const handleClose = (done: () => void) => {
  shareForm.value.username = ''
  done()
}

const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 判断是分享提交还是删除提交
      if (shareForm.value.type === 'share') {
        // 分享提交
        dialogVisible.value = false
        shareDiaryAPI(shareForm.value).then(res => {
          if (res.code === 200) {
            ElMessage.success('分享日记成功')
            clean()
            getDiatyList()
          }
        })
      } else {
        ruleFormRef.value.clearValidate()
        // 删除提交
        dialogVisible.value = false
        falseDeleteDiaryAPI(shareForm.value.id).then(res => {
          if (res.code === 200) {
            ElMessage.success('删除日记成功')
            clean()
            getDiatyList()
          }
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

const showInput = ref(false)

const share = (diaryId) => {
  clean()
  dialogVisible.value = true
  showInput.value = true
  shareForm.value.id = diaryId
  shareForm.value.type = 'share'
  title.value = '分享日记'
  getDiaryByIdAPI(diaryId).then((res) => {
    form.value = res.data
  })
}

const remove = (diaryId) => {
  clean()
  dialogVisible.value = true
  showInput.value = false
  shareForm.value.id = diaryId
  shareForm.value.type = 'delete'
  shareForm.value.username = 'delete'
  title.value = '删除日记'
  getDiaryByIdAPI(diaryId).then((res) => {
    form.value = res.data
  })
}
</script>

<template>
  <div class="top">
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
    <el-descriptions border :column="1" direction="vertical" :style="blockMargin">
      <el-descriptions-item label="标题">{{ form.title }}</el-descriptions-item>
      <el-descriptions-item label="时间">{{ form.date }}</el-descriptions-item>
      <el-descriptions-item label="内容">{{ form.content }}</el-descriptions-item>
    </el-descriptions>
    <el-form v-show="showInput" ref="ruleFormRef" :rules="rules" :model="shareForm" label-width="auto">
      <el-form-item label="分享给" prop="username">
        <el-input style="width: 200px;" clearable :prefix-icon="User" v-model="shareForm.username" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="submit(ruleFormRef)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 日记列表 -->
  <div class="diaries">
    <el-table :data="diaries" :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }"
      stripe border style="width: 80%">
      <el-table-column prop="title" label="标题" show-overflow-tooltip="true" />
      <el-table-column prop="date" label="时间" />
      <el-table-column prop="content" label="内容">
        <template v-slot="scope">
          <p class="descStyle">{{ scope.row.content }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button circle :icon="Share" @click="share(scope.row.id)" />
          <el-button type="danger" circle :icon="Delete" @click="remove(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
    :current-page="pagination.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pagination.pageSize"
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

.diary-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.diary-list {
  list-style: none;
  padding: 0;
}

.diary-item {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
}

.diary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.diary-content {
  font-size: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* 限制显示两行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.diary-date {
  font-style: italic;
}

.el-pagination {
  display: flex;
  justify-content: center;
}

.diaries {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.diary {
  width: 45%;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
}

.descStyle {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2; //行数
  -webkit-box-orient: vertical;
}

.el-form {
  margin-top: 20px;
}
</style>