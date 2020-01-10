<template>
  <el-dialog :visible.sync="visible" width="600px" center
    :title="title" class="dialog-detail-right">

    <el-form ref="form" :model="detail" :rules="rules" label-width="100px">

      <el-form-item prop="name" label="权限名:">
        <el-input v-model="detail.name" placeholder="权限名" />
      </el-form-item>

      <el-form-item prop="code" label="权限 CODE:">
        <el-input v-model="detail.code" placeholder="权限 CODE (不可重复, 大小写敏感, 建议全部小写)" />
      </el-form-item>

      <el-form-item prop="type" label="权限类型:">
        <el-select @change="typeChange" v-model="detail.type" placeholder="权限类型">
          <el-option v-for="(item, idx) in typeList" :key="idx" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>

      <el-form-item prop="url" label="前端路由:">
        <el-input v-model="detail.url" placeholder="前端路由 (权限类型为 页面、目录 时为必填)" />
      </el-form-item>

      <el-form-item prop="icon" label="权限图标:">
        <el-input v-model="detail.icon" placeholder="权限图标 (左侧栏展示)" />
      </el-form-item>

      <el-form-item prop="tip" label="提示文案:">
        <el-input v-model="detail.tip" placeholder="权限提示文案 (用户页面展示)" />
      </el-form-item>

      <el-form-item prop="description" label="权限描述:">
        <el-input v-model="detail.description" placeholder="权限描述 (用户页面展示)" />
      </el-form-item>

    </el-form>

    <span slot="footer">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </span>

  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { rightSave } from '@/api/auth';

interface Detail {
  id?: number
  parentId?: number
  previousSiblingId?: number
  name?: string
  code?: string
  url?: string
  type?: string
  icon?: string
  tip?: string
  description?: string
  enable?: boolean
}

type typeDetail = Detail | undefined

@Component({
  props: {
    typeList: {
      type: Array,
      required: true,
    },
  },
})
export default class AuthRightDialog extends Vue {
  title: string = ''

  visible: boolean = false

  detail: Detail = {}

  detailBackup: Detail = {}

  rules: any = {
    name: [
      { required: true, message: '请输入权限名' },
    ],
    code: [
      { required: true, message: '请输入权限CODE' },
    ],
    type: [
      { required: true, message: '请选择权限类型' },
    ],
    url: [],
  }

  parent: typeDetail = undefined

  previousSibling: typeDetail = undefined

  constructor() {
    super();
    this.detailBackup = JSON.parse(JSON.stringify(this.detail));
  }

  typeChange(val?: string) {
    if (val === 'page' || val === 'page-dir') {
      this.rules.url.push({
        required: true,
        message: '请输入前端路由',
      });
    } else {
      this.rules.url = [];
    }
  }

  open(detail: typeDetail, parent: typeDetail, previousSibling: typeDetail) {
    this.detail = JSON.parse(JSON.stringify(this.detailBackup));
    if (detail) {
      this.title = '修改权限';
      this.typeChange(detail.type);
      this.detail = {
        id: detail.id,
        parentId: detail.parentId,
        name: detail.name,
        code: detail.code,
        url: detail.url,
        type: detail.type,
        icon: detail.icon,
        tip: detail.tip,
        description: detail.description,
        enable: detail.enable,
      };
    } else {
      this.title = '新增权限';
      this.parent = parent;
      this.previousSibling = previousSibling;
      this.detail.parentId = parent ? parent.id : undefined;
      // eslint-disable-next-line no-nested-ternary
      this.detail.enable = previousSibling ? previousSibling.enable : (
        parent ? parent.enable : true
      );
      this.detail.previousSiblingId = previousSibling ? previousSibling.id : undefined;
      this.typeChange();
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
      rightSave(params).then(({ data: res }) => {
        this.$message.success(res.info || '保存成功');
        this.close();
      }).catch(err => this.$message.error(err.message));
    });
  }

  close() {
    this.$emit('close');
    this.visible = false;
  }
}
</script>
