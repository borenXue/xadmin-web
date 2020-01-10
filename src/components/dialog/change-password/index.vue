<template>
  <el-dialog
    title="修改密码" center @open="dialogOpen" @closed="dialogClosed"
    :visible.sync="visible" v-if="vIf" :fullscreen="false"
    :close-on-click-modal="false" :close-on-press-escape="false"
    width="500px" custom-class="xtool-element-dialog--password">

    <el-form :model="detail" :rules="rules" ref="elform"
      inline label-width="100px">

      <el-form-item prop="oldPassword" label="当前密码:">
        <el-input type="password" v-model="detail.oldPassword" placeholder="请输入当前密码" />
      </el-form-item>

      <el-form-item prop="newPassword" label="新密码:">
        <el-input type="password" v-model="detail.newPassword"
          @input="() => revalidField('newPasswordAgain')" placeholder="请输入新密码" />
      </el-form-item>

      <el-form-item prop="newPasswordAgain" label="确认新密码:">
        <el-input type="password" v-model="detail.newPasswordAgain"
           @keyup.enter.native="handleChangePassword"
          @input="() => revalidField('newPassword')" placeholder="请再次输入新密码" />
      </el-form-item>

    </el-form>

    <el-button slot="footer" type="primary" :loading="loading" @click.native.prevent="handleChangePassword">
      修  改
    </el-button>

  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { changePassword } from '@/api/auth';

@Component({})
export default class ChangePasswordDialog extends Vue {
  loading: boolean = false
  visible: boolean = false
  vIf: boolean = true

  detail: {
    oldPassword: string
    newPassword: string
    newPasswordAgain: string
  } = {} as any

  rules: any = {
    oldPassword: { required: true, message: '请输入当前密码' },
    newPassword: [
      { required: true, message: '请输入新密码' },
      { validator: this.validatorNewPassword.bind(this) },
    ],
    newPasswordAgain: [
      { required: true, message: '请再次输入新密码' },
      { validator: this.validatorNewPassword.bind(this) },
    ],
  }

  revalidField(prop: 'newPassword' | 'newPasswordAgain') {
    if (!this.detail[prop]) return;
    if (!this.$refs.elform) return;
    this.$nextTick(() => {
      (this.$refs.elform as any).validateField(prop);
    });
  }

  validatorNewPassword(rule: any, value: string, cb: Function) {
    if (!this.detail.newPassword || !this.detail.newPasswordAgain) return cb();
    if (this.detail.newPassword !== this.detail.newPasswordAgain) return cb(new Error('两次输入的新密码不一致'));
    return cb();
  }

  dialogOpen() {
    this.detail = {
      oldPassword: '',
      newPassword: '',
      newPasswordAgain: '',
    };
    this.$nextTick(() => {
      if (this.$refs.elform) (this.$refs.elform as any).clearValidate();
    });
  }

  dialogClosed() {
    this.vIf = false;
  }

  open() {
    this.visible = true;
  }

  handleChangePassword() {
    (this.$refs.elform as any).validate((valid: boolean) => {
      if (!valid) return;
      this.loading = true;
      changePassword(this.detail.newPassword, this.detail!.oldPassword).then(({ data: res }) => {
        this.loading = false;
        this.visible = false;
        this.$message.success(res.info || '密码修改成功');
      }).catch((err: any) => {
        this.loading = false;
        this.$message.error(err.message || '修改失败, 请检查后重新提交');
      });
    });
  }
}
</script>
