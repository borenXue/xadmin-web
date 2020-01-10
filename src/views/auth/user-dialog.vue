<template>
  <el-dialog class="dialog-auth-user" :visible.sync="visible" :title="title" width="500px" :center="true">

    <el-form ref="form" :model="detail" :rules="rules" label-width="100px">

      <el-form-item prop="userName" label="用户姓名:">
        <el-input v-model="detail.userName" :disabled="onlyLook" placeholder="用户姓名 (姓名不可用来登录)" />
      </el-form-item>

      <el-form-item prop="loginName" label="登录名:">
        <el-input v-model="detail.loginName" :disabled="onlyLook" placeholder="登录名" />
      </el-form-item>

      <el-form-item prop="cellphone" label="手机号:">
        <el-input v-model="detail.cellphone" :disabled="onlyLook" placeholder="手机号" />
      </el-form-item>

      <el-form-item prop="roles" label="角色:">
        <el-select
          v-model="detail.roles" filterable
          :disabled="onlyLook"
          :filter-method="rolesFilter" multiple placeholder="该用户拥有的角色">
          <el-option
            v-for="item in roleListCurrent" :key="item.id"
            :value="item.id" :label="item.name" :disabled="!item.enable">
            <span style="float: left">{{ item.name }}</span>
            <span style="
              float: right; color: #8492a6; font-size: 13px;
              margin-right: 20px; margin-left: 20px;">
              {{ item.code }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="email" label="邮箱:">
        <el-input v-model="detail.email" :disabled="onlyLook" placeholder="邮箱" />
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
import { userSave, roleList } from '@/api/auth';

interface userDetail {
  id?: number
  userName?: string
  loginName?: string
  cellphone?: string
  email?: string
  roles?: any[]
  roleIds?: any[]
}

@Component({})
export default class AuthUserDialog extends Vue {
  @Prop({ required: true }) roleList!: any[]
  roleListCurrent: any[] = []

  @Watch('roleList')
  watchRoleList(val: any[]) {
    this.roleListCurrent = val.slice();
  }

  title: string = ''
  visible: boolean = false
  onlyLook: boolean = true
  detail: userDetail = { roles: [] }
  rules: any = {
    userName: [
      { required: true, message: '请输入用户名' },
    ],
    loginName: [
      { required: true, message: '请输入登录名' },
    ],
  }


  close() {
    this.$emit('close');
    this.visible = false;
  }
  open(detail: userDetail, onlyLook: boolean = false) {
    this.detail = { roles: [] };
    this.onlyLook = onlyLook;
    if (detail) {
      this.title = onlyLook ? '查看用户详情' : '编辑用户';
      this.detail = {
        id: detail.id,
        userName: detail.userName,
        loginName: detail.loginName,
        cellphone: detail.cellphone,
        email: detail.email,
        roles: detail.roleIds || [],
      };
    } else {
      this.title = '新增用户';
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
      userSave(params).then((res) => {
        this.$message.success(res.data.msg || '保存成功');
        this.close();
      }).catch((err: any) => this.$message.error(err.message));
      return;
    });
  }

  rolesFilter(str: string) {
    this.roleListCurrent = this.roleList.filter((item) => {
      if (item.name.toUpperCase().indexOf(str.toUpperCase()) >= 0) return true;
      if (item.code.toUpperCase().indexOf(str.toUpperCase()) >= 0) return true;
      return false;
    });
  }
}
</script>
