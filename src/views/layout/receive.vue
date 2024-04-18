<script lang="ts" setup>
import { ref } from 'vue'
import { getReceivedDiaryAPI, getReceivedDiaryByIdAPI } from '@/api/diary'
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

const getReceivedDiary = () => {
  queryParams.value.currentPage = pagination.value.currentPage
  queryParams.value.pageSize = pagination.value.pageSize
  queryParams.value.queryTitle = queryTitle.value
  queryParams.value.queryTime = queryTime.value
  getReceivedDiaryAPI(queryParams.value).then(res => {
    diaries.value = res.data.records
    pagination.value.total = res.data.total
  })
}

const handleSizeChange = (size) => {
  pagination.value.pageSize = size;
  getReceivedDiary();
};

const handleCurrentChange = (page) => {
  pagination.value.currentPage = page;
  getReceivedDiary();
};

const query = () => {
  pagination.value.currentPage = 1; // Reset to the first page
  getReceivedDiary();
};

getReceivedDiary();

const diaries = ref([
])

const form = ref({
  title: '',
  content: '',
  date: '',
  username: '',
  shareTime: ''
})

const dialogVisible = ref(false)

const detail = (diaryId) => {
  dialogVisible.value = true
  getReceivedDiaryByIdAPI(diaryId).then(res => {
    if (res.code === 200) {
      form.value = res.data
    }
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
  <el-dialog v-model="dialogVisible" title="收记详情" width="700">
    <!-- 表单 -->
    <el-descriptions border :column="1" direction="vertical" :style="blockMargin">
      <el-descriptions-item label="标题">{{ form.title }}</el-descriptions-item>
      <el-descriptions-item label="时间">{{ form.date }}</el-descriptions-item>
      <el-descriptions-item label="内容">{{ form.content }}</el-descriptions-item>
      <el-descriptions-item label="分享人">{{ form.username }}</el-descriptions-item>
      <el-descriptions-item label="分享时间">{{ form.shareTime }}</el-descriptions-item>
    </el-descriptions>
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
          <el-button @click="detail(scope.row.id)">查看详情</el-button>
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