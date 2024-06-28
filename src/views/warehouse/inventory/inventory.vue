<script setup>
import { reactive, ref, computed } from 'vue';
import useDealCompanyData from '@/views/product/dealCompanyManage/useDealCompanyData';
import useGroupData from '@/views/product/groupManage/useGroupData';
import useUnitData from '@/views/product/unitManage/useUnitData';
import useProductData from '@/views/product/productManage/useProductData';

// 往来公司
const { dealCompanyData, getDealCompanyList, getDealCompanyName } =
  useDealCompanyData();
getDealCompanyList({ page: 1, size: 100 });

const { groupOptions, getGroupList, getGroupName } = useGroupData();
getGroupList({ status: 1 });

const { getUnitList, getUnitName } = useUnitData();
getUnitList();

const searchInfo = reactive({});

const { productSelectData, getProductList } = useProductData();

getProductList(searchInfo.value);
</script>

<template>
  <div class="inventory">
    <div class="head">
      <div class="search-wrap">
        <div class="option" style="width: 120px">
          <div class="value">
            <el-input
              v-model="searchInfo.product_name"
              placeholder="请输入产品名称"
              clearable
            />
          </div>
        </div>
        <div class="option" style="width: 130px">
          <div class="value">
            <el-select
              v-model="searchInfo.deal_company_id"
              placeholder="往来公司查询"
              clearable
            >
              <el-option
                v-for="item in dealCompanyData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div class="option" style="width: 130px">
          <div class="value">
            <el-select
              v-model="searchInfo.group_id"
              placeholder="产品分类查询"
              clearable
            >
              <el-option
                v-for="item in groupOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div class="option" style="width: 115px">
          <div class="value">
            <el-select
              v-model="searchInfo.status"
              placeholder="请选择状态"
              clearable
            >
              <el-option label="待审批" :value="0" />
              <el-option label="入库完成" :value="1" />
              <el-option label="已驳回" :value="2" />
            </el-select>
          </div>
        </div>
      </div>
      <div class="btn">
        <el-button type="primary" @click="getProductList(searchInfo)">
          查询
        </el-button>
      </div>
    </div>
    <div class="table">
      <el-table
        :data="productSelectData"
        border
        :header-cell-style="{ 'background-color': '#DDE2EE' }"
        align="center"
        height="100%"
      >
        <el-table-column prop="name" label="产品名称" align="center" />
        <el-table-column prop="spec" label="产品规格" align="center" />
        <el-table-column prop="code" label="产品编码" align="center" />
        <el-table-column prop="group_id" label="产品分类" align="center">
          <template #default="scope">
            {{ getGroupName(scope.row.group_id) }}
          </template>
        </el-table-column>
        <el-table-column prop="unit_id" label="单位" align="center">
          <template #default="scope">
            {{ getUnitName(scope.row.unit_id) }}
          </template>
        </el-table-column>
        <el-table-column prop="init_num" label="初始库存" align="center" />
        <el-table-column prop="pay_price" label="初始入库价格" align="center" />
        <el-table-column
          prop="sell_price"
          label="初始出库价格"
          align="center"
        />
        <el-table-column prop="add_num" label="入库数量" align="center" />
        <el-table-column prop="add_price" label="入库总价格" align="center" />
        <el-table-column prop="remove_num" label="出库数量" align="center" />
        <el-table-column
          prop="remove_price"
          label="出库总价格量"
          align="center"
        />
        <el-table-column prop="code" label="库存数量" align="center">
          <template #default="scope">
            {{ (scope.row.init_num || 0) + (scope.row.add_num || 0) - (scope.row.remove_num || 0) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.inventory {
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .head {
    margin: 10px 0;
    box-sizing: border-box;
    padding: 0 15px 0px;
    width: 100%;
    border-bottom: 1px solid #eee;
    display: flex;
    flex-wrap: wrap;
    .search-wrap {
      display: flex;
      flex-wrap: wrap;
      .option {
        display: flex;
        align-items: center;
        margin-right: 15px;
        margin-bottom: 10px;
        .label {
          margin-right: 10px;
          font-size: 14px;
          color: #666;
          width: 70px;
        }
        .value {
          flex: 1;
        }
      }
    }
    .btn {
      margin-right: 10px;
    }
  }
  .table {
    width: 100%;
    flex: 1;
    box-sizing: border-box;
    padding: 0 15px;
  }
  .paging {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
}
</style>

