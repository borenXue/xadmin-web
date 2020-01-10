<template>
  <el-container v-loading="loading">
    <el-header>
      <el-button size="small" type="primary" @click="createNew">新增一级权限</el-button>

      <el-switch
        v-model="switchOpenExpandAll"
        active-color="#13ce66"
        active-text="展开全部"
        @change="() => this.tableExpand(this.switchOpenExpandAll)" />
      <el-switch
        v-model="enableSortable"
        active-color="#13ce66"
        active-text="拖拽排序"
        @change="toggleSortable(enableSortable)" />
    </el-header>

    <el-main>
      <el-table ref="table" :data="tableData" border
        row-key="id" @expand-change="tableExpandChange"
        :cell-class-name="({ row }) => row.enable ? 'right-enable' : 'right-disable'"
        :row-class-name="({ row }) => `
          ${!row.isLeaf ? 'clickable-row' : ''}
          data-id-${row.id}
          ${row.enable ? 'right-enable' : 'right-disable'}
        `">
        <el-table-column prop="name" label="权限名" min-width="200px" />
        <el-table-column prop="code" label="权限CODE" min-width="200px" />
        <el-table-column prop="type" label="权限类型" min-width="100px">
          <template slot-scope="scope">
            {{ scope.row.type | filterArray(typeList) }}
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" min-width="130px" />
        <el-table-column prop="enable" label="启用" min-width="120px" />
        <el-table-column prop="description" label="描述" min-width="120px" />
        <el-table-column prop="tip" label="提示文案" min-width="120px" />
        <el-table-column label="操作" prop="action" fixed="right" min-width="265px">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.enable" type="primary" size="mini" @click="actionEnable(scope.row.id)">
              启用
            </el-button>
            <el-button v-if="scope.row.enable" type="primary" size="mini" @click="actionDisable(scope.row.id)">
              禁用
            </el-button>
            <el-button type="success" size="mini"
                       :disabled="!hasNextSibling(scope.row)"
                       icon="el-icon-bottom" circle @click="moveDownOrUp(scope.row, true)" />
            <el-button type="success" size="mini"
                       :disabled="!hasPreviousSibling(scope.row)"
                       icon="el-icon-top" circle @click="moveDownOrUp(scope.row, false)" />
            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="actionEdit(scope.row)" />
            <el-dropdown style="margin: 0 15px;" @command="handleCreateCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="[scope.row, 'add-child']" icon="el-icon-plus">
                  新增子权限
                </el-dropdown-item>
                <el-dropdown-item :command="[scope.row, 'add-next-sibling']" icon="el-icon-plus">
                  新增同级权限
                </el-dropdown-item>
                <el-dropdown-item :command="[scope.row, 'move-to-top-level']" :disabled="scope.row.level === 1">
                  设置为一级权限
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button v-if="!scope.row.enable" icon="el-icon-delete" circle
              type="danger" size="mini" @click="actionDelete(scope.row.id)" />
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <RightDialog ref="dialogRight" :type-list="typeList" @close="queryList()" />

  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SortableEvent } from 'sortablejs';
import {
  rightList, rightMove, rightDelete, rightEnable, rightDisable,
} from '@/api/auth';
import RightDialog from './right-dialog.vue';
import MixinSortableTable from '@/utils/mixins/table-sortable-mixin';

@Component({
  components: { RightDialog },
})
@MixinSortableTable
export default class ViewAuthRight extends Vue {
  switchOpenExpandAll: boolean = false

  tableData: any[] = []

  loading: boolean = false

  typeList = [
    { id: 'page', name: '页面' },
    { id: 'page-dir', name: '目录' },
    { id: 'button', name: '按钮' },
    { id: 'interface', name: '接口' },
  ]

  mounted() {
    this.queryList(false);
  }

  queryList(needReLayout: boolean = false, successTip?: string) {
    if (needReLayout) this.tableData = [];
    this.loading = true;
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
      this.tableData = addPropIsLeafAndLevel(res.data || []);
      (this as any).$queryListAfter && (this as any).$queryListAfter(); // eslint-disable-line no-unused-expressions
      this.loading = false;
      if (successTip) {
        this.$message.success(successTip);
      }
    }).catch((err) => {
      this.$message.error(err.message);
      this.loading = false;
    });
  }


  /**
   * 页面头部相关逻辑
   */

  createNew() {
    (this.$refs.dialogRight as any).open();
  }

  tableExpand(isExpand: boolean, item: any) {
    if (!item) {
      for (const rowItem of this.tableData) {
        this.tableExpand(isExpand, rowItem);
      }
      return;
    }
    if (item.isLeaf) return;
    (this.$refs.table as any).toggleRowExpansion(item, isExpand);
    for (const child of item.children) {
      this.tableExpand(isExpand, child);
    }
  }


  /**
   * 表格操作列相关逻辑
   */

  hasNextSibling(item: any) {
    return this.$tableDataSibling(item, this.tableData)[1];
  }

  hasPreviousSibling(item: any) {
    return this.$tableDataSibling(item, this.tableData)[0];
  }

  moveDownOrUp(row: any, isDown: boolean) {
    const siblings = this.$tableDataSibling(row, this.tableData);
    if (siblings && siblings.length > 0) {
      const item = isDown ? siblings[1] : siblings[0];
      if (item) { // 存在下个同级节点
        this.loading = true;
        const movePromise = isDown ? rightMove(item.id, row.id, 'before') : rightMove(row.id, item.id, 'before');
        movePromise.then(() => {
          this.queryList();
        }).catch((err) => {
          this.loading = false;
          this.$message.error(err.message);
        });
      } else {
        this.$message.warning(`不能再往${isDown ? '下' : '上'}移啦`);
      }
    }
  }

  actionEdit(item: any) { (this.$refs.dialogRight as any).open(item); }

  async actionDelete(id: number) {
    await this.$xconfirm('确认删除该权限吗？', {
      type: 'warning',
      title: '操作确认',
    });
    this.loading = true;
    rightDelete(id).then(({ data: res }) => {
      this.queryList(false, '删除成功');
    }).catch((err) => {
      this.loading = false;
      this.$message.error(err.message);
    });
  }

  async actionEnable(id: number) {
    await this.$xconfirm('确认启用该权限吗？', {
      type: 'warning',
      title: '操作确认',
    });
    this.loading = true;
    rightEnable(id).then(({ data: res }) => {
      this.queryList(false, '启用成功');
    }).catch((err) => {
      this.loading = false;
      this.$message.error(err.message);
    });
  }

  async actionDisable(id: number) {
    await this.$xconfirm('确认启用该权限吗？', {
      type: 'warning',
      title: '操作确认',
    });
    this.loading = true;
    rightDisable(id).then(({ data: res }) => {
      this.queryList(false, '禁用成功');
    }).catch((err) => {
      this.loading = false;
      this.$message.error(err.message);
    });
  }

  handleCreateCommand([row, command]: [any, string]) {
    if (command === 'move-to-top-level') {
      this.loading = true;
      rightMove(row.id, row.parentId, 'after').then(() => {
        this.queryList();
      }).catch((err) => {
        this.loading = false;
        this.$message.error(err.message);
      });
    } else if (command === 'add-child') {
      this.createNew();
    } else if (command === 'add-next-sibling') {
      this.createNew();
    }
  }


  /**
   * 排序辅助 - 与滑动排序无头
   */
  tableExpandChange(...rest: any[]) {
    const self = this as any;
    if (typeof self.$tableExpandChange === 'function') {
      self.$tableExpandChange(...rest);
    }
  }

  $tableDataSibling(row: any, list: any) {
    for (let i = 0; i < list.length; i += 1) {
      if (row === list[i]) {
        return [list[i - 1], list[i + 1]]; // nextItem 或者 undefined
      }
      if (list[i].children && list[i].children.length > 0) {
        const siblings: any = this.$tableDataSibling(row, list[i].children);
        if (siblings && siblings.length > 0) return siblings;
      }
    }
    return [];
  }
}
</script>

<style lang="scss" scoped>
::v-deep tr.right-disable {
  color: #bdbdbd;
}
</style>
