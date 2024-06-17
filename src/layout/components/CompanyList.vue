<script setup>
import { ref, computed, watch } from 'vue';
import { Close } from '@element-plus/icons-vue';
import useCompanyData from '@/views/power/companyManage/useCompanyData';
import useUserData from '@/views/power/userManage/useUserData';
import { useMainStore } from '@/store';
import { ElMessage } from 'element-plus';

const { companyData, getCompanyList } = useCompanyData();
getCompanyList({ page: 1, size: 100 });

const { switchCompanyClick } = useUserData();
const companyInfo = ref({});

const mainStore = useMainStore();
const myCompany = computed(() => mainStore.companyInfo);
watch(
  () => myCompany.value.show_company_id,
  () => {
    companyInfo.value.id = myCompany.value.show_company_id;
  },
  { immediate: true },
);
const companyClick = (company) => {
  if (!company.id) {
    companyInfo.value = {
      id: company.company_id,
      name: company.company_name,
      logo: company.company_logo,
    };
    return;
  }
  companyInfo.value = company;
};

const emit = defineEmits(['close', 'confirm']);
const closeClick = () => {
  emit('close');
};

const confirmClick = async () => {
  if (companyInfo.value.id === mainStore.companyInfo.show_company_id) {
    return ElMessage.warning('当前公司已是所选公司');
  }
  await switchCompanyClick({
    company_id: companyInfo.value.id,
  });
  emit('confirm');
  return '';
};
</script>

<template>
  <div class="mask"></div>
  <div class="company-list">
    <div class="company-head">
      <div class="title">
        切换公司
      </div>
      <div class="close" @click="closeClick">
        <el-icon><Close /></el-icon>
      </div>
    </div>
    <div class="list-wrap">
      <div
        v-for="item in companyData"
        :key="item.id"
        class="company"
        :class="{ active: item.id === companyInfo.id }"
        @click="companyClick(item)"
      >
        <div class="logo">
          <img v-if="item.logo" :src="item.logo" alt="" />
          <svg-icon v-else name="company" />
        </div>
        <div class="name">
          {{ item.name }}
        </div>
      </div>
      <div
        v-if="myCompany.show_company_id !== myCompany.company_id"
        class="company"
        :class="{ active: myCompany.company_id === companyInfo.id }"
        @click="companyClick(myCompany)"
      >
        <div class="logo">
          <img v-if="myCompany.logo" :src="myCompany.logo" alt="" />
          <svg-icon v-else name="company" />
        </div>
        <div class="name">
          {{ myCompany.company_name }}
        </div>
      </div>
    </div>
    <div class="tool">
      <div class="btn">
        <el-button type="info" @click="closeClick">
          取消
        </el-button>
      </div>
      <div class="btn">
        <el-button type="primary" @click="confirmClick">
          确认
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.company-list {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 650px;
  height: 500px;
  background-color: #fff;
  z-index: 2000;
  transform: translate(-50%, -60%);
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .company-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 0 15px;
    background-color: #f3f3f3;
    .title {
      font-size: 16px;
    }
    .close {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 20px;
      color: #333;
      &:hover {
        color: #ff0000;
      }
    }
  }
  .list-wrap {
    flex: 1;
    padding: 5px 10px;
    overflow-y: auto;
    display: flex;
    .company {
      width: 100px;
      height: 100px;
      display: flex;
      align-content: flex-start;
      justify-content: center;
      flex-wrap: wrap;
      align-items: center;
      box-sizing: border-box;
      border-radius: 3px;
      cursor: pointer;
      // background-color: #d6c9c9;
      border: 1px solid #eee;
      margin: 5px;
      .logo {
        width: 55px;
        height: 55px;
        background-color: #eee;
        font-size: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: #409eff;
        color: #fff;
        margin-top: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .name {
        width: 100%;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
      }
    }
    .active {
      border: 1px solid #4694fa;
      background-color: #f1f8ff;
    }
  }
  .tool {
    height: 50px;
    display: flex;
    background-color: #f1f8ff;
    justify-content: center;
    .btn {
      margin: 0 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
}
</style>
