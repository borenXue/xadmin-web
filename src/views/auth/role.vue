<template>
  <el-container v-loading="loading">

    <el-header>
      <el-input v-model="searchInfo.name" style="width:200px;" placeholder="角色名" />
      <el-input v-model="searchInfo.code" style="width:200px;" placeholder="角色 code" />
      <el-select v-model="searchInfo.enable" clearable placeholder="是否启用" style="width:120px;">
        <el-option
          v-for="(item, idx) in [{id: true, name:'启用'}, {id: false, name:'禁用'}]"
          :key="idx"
          :label="item.name"
          :value="item.id" />
      </el-select>
      <el-cascader
        v-model="searchInfo.rights"
        :options="rightsList"
        :props="{
          expandTrigger: 'hover',
          multiple: true,
          checkStrictly: true,
          value: 'id',
          label: 'name',
          leaf: 'isLeaf'
        }"
        placeholder="选择权限 (或)" />
      <el-button type="primary" @click="queryList(true)">查询</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button type="primary" @click="createNew">新增</el-button>
    </el-header>


    <el-main>
      <el-table :data="tableData" border
        :cell-class-name="({ row }) => row.enable ? 'role-enabled' : 'role-disabled'">
        <el-table-column prop="name" label="角色名" min-width="170px"/>
        <el-table-column prop="code" label="角色 CODE" min-width="170px"/>
        <el-table-column prop="enable" label="是否启用" min-width="100px">
          <template slot-scope="scope">
            {{ scope.row.enable ? '启用' : '禁用' }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="角色描述" min-width="200px"/>
        <el-table-column label="操作" fixed="right" min-width="200px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.enable" type="primary" size="mini" @click="actionDisable(scope.row.id)">
              禁用
            </el-button>
            <el-button
              v-else type="primary" size="mini" @click="actionEnable(scope.row.id)">
              启用
            </el-button>
            <el-button type="primary" icon="el-icon-view" circle size="mini" @click="actionDetail(scope.row)" />
            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="actionEdit(scope.row)" />
            <el-button v-if="!scope.row.enable" type="danger" icon="el-icon-delete" circle size="mini" @click="actionDelete(scope.row.id)" />
          </template>
        </el-table-column>
      </el-table>
    </el-main>


    <el-footer>
      <el-pagination
        :current-page.sync="pageInfo.pageNum"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="pageInfo.total"
        @current-change="queryList"
        :page-sizes="[10, 20, 30, 50, 100]"
        @size-change="handleSizeChange"/>
    </el-footer>

    <RightDialog :rights-list="rightsList" ref="rightDialog" @close="queryList" />

  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  rightList, roleList, roleDisable, roleEnable,
} from '@/api/auth';
import RightDialog from './role-dialog.vue';


@Component({
  components: { RightDialog },
})
export default class ViewAuthRole extends Vue {
  loading: boolean = false
  searchInfo: any = {
    rights: [],
  }
  pageInfo = {
    pageSize: 10,
    pageNum: 1,
    total: 0,
  }
  pageInfoBackup = undefined

  rightsList: any[] = []

  tableData: any[] = []

  constructor() {
    super();
    this.initDatas();
  }

  mounted() {
    this.queryList();
  }

  initDatas() {
    rightList().then(({ data: res }) => {
      function addPropIsLeafAndLevel(list: any[], level: number = 1) {
        for (const item of list) {
          item.isLeaf = true;
          item.level = level;
          if (item.children && item.children.length > 0) {
            item.isLeaf = false;
            addPropIsLeafAndLevel(item.children, level + 1);
          }
        }
        return list;
      }
      this.rightsList = addPropIsLeafAndLevel(res.data || []);
    }).catch(err => this.$message.error(err.message));
  }

  reset() {
    this.searchInfo = { rights: [] };
    this.queryList(true);
  }

  handleSizeChange(val: any) {
    this.pageInfo.pageSize = val;
    this.queryList();
  }
  queryList(forceZero?: boolean, successTip?: string) {
    if (forceZero === true) {
      this.pageInfo.pageNum = 1;
    }
    const params = JSON.parse(JSON.stringify(this.searchInfo));
    params.rights = params.rights.map((item: any) => item[item.length - 1]).join(',');
    params.pageNum = this.pageInfo.pageNum;
    params.pageSize = this.pageInfo.pageSize;
    this.loading = true;
    roleList(params).then(({ data: res }) => {
      this.tableData = res.data.content || [];
      this.pageInfo.total = res.data.total;
      this.pageInfo.pageNum = res.data.pageNum;
      this.pageInfo.pageSize = res.data.pageSize;
      this.loading = false;
      if (successTip) {
        this.$message.success(successTip);
      }
    }).catch((err: any) => {
      this.$message.error(err.message);
      this.loading = false;
    });
  }

  async actionDisable(id: number) {
    await this.$xconfirm('确认禁用该角色吗？', {
      type: 'warning',
      title: '操作确认',
    });
    this.loading = true;
    roleDisable(id).then(({ data: res }) => {
      this.queryList(false, res.msg || '禁用成功');
    }).catch((err: any) => {
      this.loading = false;
      this.$message.error(err.message);
    });
  }

  async actionDelete(id: number) {
    await this.$xconfirm('确认删除该角色吗？', {
      type: 'warning',
      title: '操作确认',
    });
    this.loading = true;
    roleDisable(id).then(({ data: res }) => {
      this.queryList(false, res.msg || '删除成功');
    }).catch((err: any) => {
      this.loading = false;
      this.$message.error(err.message);
    });
  }

  async actionEnable(id: number) {
    await this.$xconfirm('确认启用该角色吗？', {
      type: 'warning',
      title: '操作确认',
    });
    this.loading = true;
    roleEnable(id).then(({ data: res }) => {
      this.queryList(false, res.msg || '启用成功');
    }).catch((err: any) => {
      this.loading = false;
      this.$message.error(err.message);
    });
  }

  actionDetail(item: any) {
    (this.$refs.rightDialog as any).open(item, true);
  }

  actionEdit(item: any) {
    (this.$refs.rightDialog as any).open(item, false);
  }

  createNew() {
    (this.$refs.rightDialog as any).open();
  }
}
</script>
