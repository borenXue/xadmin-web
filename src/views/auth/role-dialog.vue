<template>
  <el-dialog class="dialog-auth-role" :visible.sync="visible" :title="title" width="500px" :center="true">

    <el-form ref="form" :model="detail" :rules="rules" label-width="100px">

      <el-form-item prop="name" label="角色名:">
        <el-input v-model="detail.name" :disabled="onlyLook" placeholder="角色名" />
      </el-form-item>

      <el-form-item prop="code" label="角色名:">
        <el-input v-model="detail.code" :disabled="onlyLook" placeholder="角色 CODE" />
      </el-form-item>

      <el-form-item prop="description" label="角色描述:">
        <el-input v-model="detail.description" :disabled="onlyLook" placeholder="角色描述" />
      </el-form-item>

      <el-form-item prop="rights" label="角色权限:" style="margin-bottom: 15px;">
        <el-button type="primary" size="mini" @click="selectAllRights"
          :disabled="onlyLook || rightNodeCount === detail.rights.length">
          选择全部
        </el-button>
        <el-button @click="emptyTreeCheckd" type="primary" size="mini"
          :disabled="onlyLook || detail.rights.length === 0">
          清空
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="filterText" :disabled="onlyLook" size="small" placeholder="输入权限描述和 code 快速过滤" />
        <el-tree ref="tree" :disabled="onlyLook" :data="rightsList" :props="treeProps"
          default-expand-all show-checkbox
          highlight-current check-on-click-node
          node-key="id" :default-checked-keys="treeDefaultCheckedKeys"
          :filter-node-method="filterNode" class="rights-select-tree"
          @check="treeChecked" />
      </el-form-item>

    </el-form>

    <span slot="footer">
      <el-button v-if="!onlyLook" type="primary" @click="submit">提交</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </span>

  </el-dialog>
</template>

<script lang="ts">
import {
  Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import { roleSave } from '@/api/auth';

interface RoleDetail {
  id?: number
  name?: string
  code?: string
  description?: string
  rights?: any[]
}

@Component({})
export default class AuthRoleDialog extends Vue {
  @Prop({ required: true })
  readonly rightsList!: any[]

  private rightsListAllEnableIds: number[] = []
  private rightsListAllEnable: any[] = []

  title: string = ''
  visible: boolean = false
  onlyLook: boolean = true
  detail: RoleDetail = { rights: [] }
  rules: any = {
    name: [
      { required: true, message: '请输入角色名' },
    ],
    code: [
      { required: true, message: '请输入角色code' },
    ],
    rights: [
      { required: true, message: '请选择权限' },
    ],
  }

  filterText: string = ''
  rightNodeCount: number = 0
  treeDefaultCheckedKeys: any[] = []
  treeProps: any = {
    children: 'children',
    label: 'name',
    disabled: this.treePropsDisabled,
  }
  treePropsDisabled(data: any, node: any) {
    return this.onlyLook || !data.enable;
  }

  @Watch('filterText')
  watchFilterText(val: string) { (this.$refs.tree as any).filter(val); }
  @Watch('rightsList')
  private calcRightsList(list: any[], reset: boolean = true) {
    if (!list) return;
    if (reset) {
      this.rightNodeCount = 0;
      this.rightsListAllEnableIds = [];
      this.rightsListAllEnable = [];
    }
    for (const item of list) { // eslint-disable-line no-restricted-syntax
      this.rightNodeCount += 1;
      if (item.enable) {
        this.rightsListAllEnableIds.push(item.id);
        this.rightsListAllEnable.push(item);
      }
      this.calcRightsList(item.children || [], false);
    }
  }

  close() {
    this.$emit('close');
    this.visible = false;
  }
  open(detail: RoleDetail, onlyLook: boolean = false) {
    this.detail = { rights: [] };
    this.filterText = '';
    this.onlyLook = onlyLook;
    if (detail) {
      this.title = onlyLook ? '查看角色详情' : '编辑角色';
      this.treeDefaultCheckedKeys = (detail as any).rightIds ? (detail as any).rightIds.slice() : [];
      delete (detail as any).rightIds;
      this.detail = {
        id: detail.id,
        name: detail.name,
        code: detail.code,
        description: detail.description,
        rights: detail.rights || [],
      };
    } else {
      this.title = '新增角色';
      this.treeDefaultCheckedKeys = [];
    }
    this.visible = true;
    this.$nextTick(() => {
      if (this.$refs.form) (this.$refs.form as any).clearValidate();
    });
  }
  submit() {
    (this.$refs.form as any).validate((pass: boolean) => {
      if (!pass) return;
      const params = JSON.parse(JSON.stringify(this.detail));
      roleSave(params).then((res) => {
        this.$message.success(res.data.msg || '保存成功');
        this.close();
      }).catch((err: any) => this.$message.error(err.message));
      return;
    });
  }

  selectAllRights() {
    (this.$refs.tree as any).setCheckedKeys(this.rightsListAllEnableIds);
    this.detail.rights = this.rightsListAllEnableIds || [];
    this.$revalidField('rights');
  }
  // 清空选择
  emptyTreeCheckd() {
    (this.$refs.tree as any).setCheckedKeys([]);
    this.detail.rights = [];
    this.$revalidField('rights');
  }
  // tree 中点击 checkbox 时触发
  treeChecked(item: any, { checkedKeys }: any) {
    this.detail.rights = checkedKeys || [];
    this.$revalidField('rights');
  }
  // 过滤 tree, 用于快速选择
  filterNode(value: any, data: any) {
    if (!value) return true;
    return data.name.indexOf(value) !== -1;
  }

  private $revalidField(prop: string) {
    if (!this.$refs.form) return;
    this.$nextTick(() => {
      (this.$refs.form as any).validateField(prop);
    });
  }
}
</script>
