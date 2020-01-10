<template>
  <div class="app-view-login">
    <div class="login-box">
      <h3 class="system-title">后台管理系统</h3>

      <el-input v-model="loginName" autocomplete="on" class="input-loginName" placeholder="登录用户名">
        <i slot="prefix" class="el-icon-user-solid el-input__icon"/>
      </el-input>

      <el-input v-model="password" autocomplete="on" class="input-password" :type="passwordInputType"
        @keyup.enter.native="loginHandler" placeholder="登录密码">
        <i slot="prefix" class="el-icon-lock el-input__icon"/>
        <i slot="suffix" class="el-icon-view el-input__icon" @click="toogleViewPassword"/>
      </el-input>

      <el-button type="primary" :disabled="validInput" @click.native.prevent="loginHandler">
        登录
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
  computed: mapGetters(['beforeLoginPage']),
})
export default class ViewLogin extends Vue {
  loginName: string = 'admin'

  password: string = '123456'

  passwordInputType: 'password' | 'text' = 'password'

  get validInput() {
    return Boolean(!this.loginName || !this.password);
  }

  toogleViewPassword() {
    if (this.passwordInputType === 'password') {
      this.passwordInputType = 'text';
    } else {
      this.passwordInputType = 'password';
    }
  }

  loginHandler() {
    this.$store.dispatch('ActionLogin', {
      userName: this.loginName,
      password: this.password,
    }).then(() => {
      this.$message.success('登录成功 ~_~');
      const to = (this as any).beforeLoginPage || '/';
      this.$router.push(to);
    }).catch(err => this.$message.error(err.message || '登录失败, 请重试'));
  }
}
</script>

<style lang="scss" scoped>
.app-view-login {
  height: 100%;
  width: 100%;
  background: #2d3a4b;

  text-align: center;

  .login-box {
    display: inline-block;
    text-align: center;
    margin-top: 150px;
    min-width: 300px;

    h3 {
      font-size: 26px;
      font-weight: 400;
      color: #eee;
      text-align: center;
      font-weight: bold;
      margin-bottom: 40px;
    }

    ::v-deep .input-loginName,
    ::v-deep .input-password {
      margin-top: 22px;
      display: block;
      i {
        color: #3e4955;
        font-size: 22px;
        margin-left: 10px;
      }
      input {
        background: #283443;
        border: 1px solid #3e4956;
        height: 52px;
        padding-left: 55px;
        color: white;
        &::placeholder {
          color: #818182;
        }
      }
      .el-input__suffix {
        padding-right: 10px;
        cursor: pointer;
        i {
          color: #afafaf;
        }
        &:hover {
          i {
            color: #e8e8e8;
          }
        }
        &:active {
          i {
            color: #afafaf;
          }
        }
      }
    }

    & > button {
      width: 100%;
      margin-top: 30px;
    }
  }

}
</style>
