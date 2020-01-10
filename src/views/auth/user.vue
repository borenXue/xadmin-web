<template>
  <el-container v-loading="loading">

    <el-header>
      <el-input v-model="searchInfo.userName" style="width:200px;" placeholder="用户姓名" />
      <el-input v-model="searchInfo.loginName" style="width:200px;" placeholder="登录名" />
      <el-select v-model="searchInfo.enable" placeholder="用户状态" style="width:120px;">
        <el-option
          v-for="(item, idx) in enableList"
          :key="idx"
          :label="item.name"
          :value="item.id" />
      </el-select>
      <el-button type="primary" @click="queryList(true)">查询</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button type="primary" @click="createNew">新增</el-button>
    </el-header>


    <el-main>
      <el-table border :data="tableData" :cell-class-name="({ row }) => row.enable ? 'user-enable' : 'user-disable'">
        <el-table-column prop="userName" label="姓名" min-width="150px" />
        <el-table-column prop="loginName" label="登录账号" min-width="150px" />
        <el-table-column prop="cellphone" label="手机号" min-width="120px" />
        <el-table-column prop="email" label="邮箱" min-width="150px" />
        <el-table-column label="操作" prop="action" fixed="right" min-width="200px">
          <template slot-scope="scope">
            <el-button v-if="scope.row.enable" @click="actionDisable(scope.row.id)" type="primary" size="mini">
              禁用
            </el-button>
            <el-button v-else @click="actionEnable(scope.row.id)" type="primary" size="mini">
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
        @size-change="handleSizeChange" />
    </el-footer>

    <UserDialog :role-list="roleList" ref="userDialog" @close="queryList"  />

  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { enableList } from '@/utils/filter/list';
import {
  userEnable, userDisable, userList, roleList,
} from '@/api/auth';
import UserDialog from './user-dialog.vue';

@Component({
  components: { UserDialog },
})
export default class ViewAuthUser extends Vue {
  loading: boolean = false
  enableList = enableList
  roleList: any[] = []

  searchInfo = {}
  pageInfo = {
    pageNum: 1,
    pageSize: 10,
    total: 0,
  }
  pageInfoBackup = undefined
  tableData: any[] = []


  constructor() {
    super();
    this.pageInfoBackup = JSON.parse(JSON.stringify(this.pageInfo));
  }

  mounted() {
    this.queryList();
    roleList({ pageSize: 9999, pageNum: 1 })
      .then(({ data: res }) => {
        this.roleList = res.data.content || [];
      }).catch(err => this.$message.error(err.messag));
  }

  reset() {
    this.pageInfo = JSON.parse(JSON.stringify(this.pageInfoBackup));
    this.searchInfo = {};
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
    params.pageNum = this.pageInfo.pageNum;
    params.pageSize = this.pageInfo.pageSize;
    this.loading = true;
    userList(params).then(({ data: res }) => {
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
  createNew() {
    (this.$refs.userDialog as any).open();
  }


  async actionDisable(id: number) {
    await this.$xconfirm('确认禁用该角色吗？', {
      type: 'warning',
      title: '操作确认',
    });
    this.loading = true;
    userDisable(id).then(({ data: res }) => {
      this.queryList(false, res.msg || '禁用成功');
    }).catch((err: any) => {
      this.loading = false;
      this.$message.error(err.message);
    });
  }

  async actionDelete(id: number) {
    await this.$xconfirm('确认删除该用户吗？', {
      type: 'warning',
      title: '操作确认',
    });
    this.loading = true;
    userDisable(id).then(({ data: res }) => {
      this.queryList(false, res.msg || '删除成功');
    }).catch((err: any) => {
      this.loading = false;
      this.$message.error(err.message);
    });
  }

  async actionEnable(id: number) {
    await this.$xconfirm('确认启用该用户吗？', {
      type: 'warning',
      title: '操作确认',
    });
    this.loading = true;
    userEnable(id).then(({ data: res }) => {
      this.queryList(false, res.msg || '启用成功');
    }).catch((err: any) => {
      this.loading = false;
      this.$message.error(err.message);
    });
  }

  actionDetail(item: any) {
    (this.$refs.userDialog as any).open(item, true);
  }

  actionEdit(item: any) {
    (this.$refs.userDialog as any).open(item, false);
  }
}
</script>
