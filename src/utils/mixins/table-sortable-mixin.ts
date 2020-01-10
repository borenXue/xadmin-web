import Sortable from 'sortablejs';
import { createDecorator } from 'vue-class-component';
import { rightMove } from '@/api/auth';

/**
 * 依赖:
 *  1、页面中有 el-table 组件, tr 元素上有 class: data-id-${id}
 *  2、this 中有以下属性或方法
 *    属性: this.$refs.table && this.tableData
 *    属性: this.loading (boolean 是否正在加载中)
 *    方法: this.queryList && this.$message
 */

const mixin = {
  data() {
    return {
      sortable: undefined,
      enableSortable: false,

      tableBody: undefined,

      expands: [],
    };
  },
  methods: {
    initSortable() {
      const self = this as any;
      self.tableBody = self.$el.querySelector('.el-table__body-wrapper tbody');
      if (!self.tableBody) return;
      self.sortable = Sortable.create(self.tableBody, {
        disabled: false,
        draggable: 'tr',
        dataIdAttr: 'data-id',
        // 用户移动操作完成后调用
        onEnd(env) {
          self.loading = true;
          const moveId = Number(env.item.dataset.id);
          const previousId = Number(
            env.item.previousElementSibling ? (env.item.previousElementSibling as any).dataset.id : undefined,
          );
          const nextId = Number(
            env.item.nextElementSibling ? (env.item.nextElementSibling as any).dataset.id : undefined,
          );
          const movePromise = nextId ? rightMove(moveId, nextId, 'before') : rightMove(moveId, previousId, 'after');
          movePromise.then((res: any) => {
            self.$message.success('保存成功');
            self.queryList();
          }).catch((err: any) => {
            self.$message.error(err.message);
            self.queryList();
          });
        },
      });
    },
    toggleSortable(enableSortable: boolean) {
      const self = this as any;
      if (enableSortable === true && !self.sortable) {
        self.initSortable();
        self.$queryListAfter();
      }
      self.sortable.option('disabled', !enableSortable);
    },
    // 表格 expand 状态改变时, 同步到 this.expands
    $tableExpandChange(row: any, expanded: any) {
      const self = this as any;
      if (!self.sortable) return;
      if (expanded) {
        self.expands.push(row.id);
      } else {
        self.expands.splice(self.expands.indexOf(row.id), 1);
      }
    },
    $queryListAfter() {
      const self = this as any;
      if (!self.sortable) return;
      self.$nextTick(() => {
        this.$$autoFillDataId(); // eslint-disable-line no-unused-expressions
        if (self.$refs.table) {
          (self.$refs.table as any).doLayout();
          this.$restoreTableExpandStatus(self.tableData); // eslint-disable-line no-unused-expressions
          self.$nextTick(() => {
            const eleLayoutView = document.querySelector('.layout-main');
            const scrollTop = eleLayoutView ? eleLayoutView.scrollTop : 0;
            if (eleLayoutView) eleLayoutView.scrollTop = scrollTop;
            self.loading = false;
          });
        }
      });
    },
    // mixin 内部方法
    $restoreTableExpandStatus(list: any) {
      const self = this as any;
      for (const item of list) {
        if (self.expands.indexOf(item.id) >= 0) {
          try {
            if (item.children && item.children > 0) {
              self.$refs.table.toggleRowExpansion(item, true);
            }
          } catch (err) {
            console.error(err) // eslint-disable-line
          }
        }
        this.$restoreTableExpandStatus(item.children || []);
      }
    },
    // mixin 的内部方法: 自动填充 table-tr 元素上的 data-id 属性, 数据来源: class 中的 data-id-${id}
    $$autoFillDataId() {
      const self = this as any;
      const trList = self.tableBody.querySelectorAll('tr.el-table__row');
      trList.forEach((tr: any) => {
        let dataIdStr = '';
        tr.classList.forEach((cls: string) => {
          if (cls.indexOf('data-id-') === 0) dataIdStr = cls;
        });
        if (dataIdStr) tr.dataset.id = dataIdStr.replace('data-id-', ''); // eslint-disable-line no-param-reassign
      });
    },
  },
  destroyed() {
    const self = this as any;
    // eslint-disable-next-line no-unused-expressions
    self.sortable && self.sortable.destroy && self.sortable.destroy();
  },
};

const MixinSortableTable = createDecorator((options, key, parameterIndex) => {
  if (!options.mixins) options.mixins = [];
  options.mixins!.push(mixin);
});

export default MixinSortableTable;
