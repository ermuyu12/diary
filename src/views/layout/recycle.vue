<script lang="ts" setup>
import { ref } from 'vue'
import { getNeedRestoreDiaryAPI, getNeedRestoreDiaryByIdAPI, restoreDiaryAPI, deleteDiaryAPI } from '@/api/diary'
import { type FormProps } from 'element-plus'


const labelPosition = ref<FormProps['labelPosition']>('top')
const queryTitle = ref(null)
const queryTime = ref(null)
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

const queryParams = ref({
  currentPage: pagination.value.currentPage,
  pageSize: pagination.value.pageSize,
  queryTitle: queryTitle.value,
  queryTime: queryTime.value
})

const getNeedRestoreDiary = () => {
  queryParams.value.currentPage = pagination.value.currentPage
  queryParams.value.pageSize = pagination.value.pageSize
  queryParams.value.queryTitle = queryTitle.value
  queryParams.value.queryTime = queryTime.value
  getNeedRestoreDiaryAPI(queryParams.value).then(res => {
    diaries.value = res.data.records
    pagination.value.total = res.data.total
  })
}

const handleSizeChange = (size) => {
  pagination.value.pageSize = size;
  getNeedRestoreDiary();
};

const handleCurrentChange = (page) => {
  pagination.value.currentPage = page;
  getNeedRestoreDiary();
};

const query = () => {
  pagination.value.currentPage = 1; // Reset to the first page
  getNeedRestoreDiary();
};

getNeedRestoreDiary();

const diaries = ref([
])

const form = ref({
  id: null,
  title: '',
  content: '',
  date: '',
  type: '',
})

const dialogVisible = ref(false)
const recycle = (diaryId) => {
  dialogVisible.value = true
  getNeedRestoreDiaryByIdAPI(diaryId).then(res => {
    form.value = res.data
    form.value.type = 'recycle'
  })
}
const remove = (diaryId) => {
  dialogVisible.value = true
  getNeedRestoreDiaryByIdAPI(diaryId).then(res => {
    form.value = res.data
    form.value.type = 'remove'
  })
}

const submit = () => {
  console.log(form.value);

  // 判断是恢复还是删除
  if (form.value.type === 'recycle') {
    // 恢复
    restoreDiaryAPI(form.value.id).then(res => {
      if (res.code === 200) {
        ElMessage.success(res.msg)
        dialogVisible.value = false
        getNeedRestoreDiary()
      }
    })
  } else {
    // 删除
    deleteDiaryAPI(form.value.id).then(res => {
      if (res.code === 200) {
        ElMessage.success(res.msg)
        dialogVisible.value = false
        getNeedRestoreDiary()
      }
    })
  }
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
  <el-dialog v-model="dialogVisible" title="日记详情" width="700">
    <!-- 表单 -->
    <el-descriptions border :column="1" direction="vertical" :style="blockMargin">
      <el-descriptions-item label="标题">{{ form.title }}</el-descriptions-item>
      <el-descriptions-item label="时间">{{ form.date }}</el-descriptions-item>
      <el-descriptions-item label="内容">{{ form.content }}</el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="submit()">
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
          <el-button @click="recycle(scope.row.id)">恢复</el-button>
          <el-button type="danger" @click="remove(scope.row.id)">删除</el-button>
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