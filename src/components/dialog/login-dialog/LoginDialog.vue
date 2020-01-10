<template>
  <el-dialog v-if="vIf" :visible.sync="visible" :custom-class="`xtool-element-dialog--login ${customClass}`"
    :close-on-click-modal="false" :close-on-press-escape="false"
    :fullscreen="false" destroy-on-close :before-close="beforeClose"
    @open="dialogOpen" @closed="dialogClosed" width="500px">

    <el-form auto-complete="on" :model="detail" :rules="rules"
      ref="elform" label-position="left">

      <h3>登录已失效, 请重新登录</h3>

      <el-form-item prop="userName">
        <el-input v-model="detail.userName" auto-complete="on" placeholder="请输入登录用户名">
          <i slot="prepend" class="el-icon-user-solid" />
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="detail.password" auto-complete="on" placeholder="请输入登录密码"
          :type="passwordInputType" @keyup.enter.native="handleLogin">
          <i slot="prepend" class="el-icon-lock" />
          <i slot="append" v-if="passwordInputType === 'text'" @click="togglePasswordInputType" class="el-icon-view" />
          <i slot="append" v-if="passwordInputType === 'password'" @click="togglePasswordInputType" class="el-icon-view" />
        </el-input>
      </el-form-item>

    </el-form>

    <el-button slot="footer" type="primary" :loading="loading" @click.native.prevent="handleLogin">
      登录
    </el-button>

  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class LoginDialog extends Vue {
  visible: boolean = false
  loading: boolean = false
  vIf: boolean = true
  passwordInputType: 'text' | 'password' = 'password'
  detail: {
    userName: string
    password: string
  } = {} as any
  rules = {
    userName: { required: true, message: '请输入登录用户名' },
    password: { required: true, message: '请输入登录密码' },
  }

  // 高斯模糊的目标元素选择器, eg: '#app'
  blurAppElement: string = ''
  // 自定义的 class 元素
  customClass: string = ''

  show() {
    this.initBlurEffect();
    this.visible = true;
  }

  close() {
    this.loading = false;
    (this as any).removeClassShowBlur();
    this.visible = false;
  }

  private dialogClosed() {
    this.vIf = false;
    (this as any).cancel();
  }

  private togglePasswordInputType() {
    if (this.passwordInputType === 'text') {
      this.passwordInputType = 'password';
    } else if (this.passwordInputType === 'password') {
      this.passwordInputType = 'text';
    }
  }

  private handleLogin() {
    (this.$refs.elform as any).validate((valid: boolean) => {
      if (!valid) return;
      this.loading = true;
      (this as any).login(
        this.detail.userName,
        this.detail.password,
        this.close as () => void,
        () => { this.loading = false; },
      );
    });
  }

  private dialogOpen() {
    this.detail = {
      userName: '',
      password: '',
    };
    this.$nextTick(() => {
      if (this.$refs.elform) (this.$refs.elform as any).clearValidate();
    });
  }

  private beforeClose(done: Function) {
    this.loading = false;
    (this as any).removeClassShowBlur();
    done();
  }

  // 给 blurAppElement 元素添加 show-blur class
  private initBlurEffect() {
    if (!this.blurAppElement) return;
    const appEle = document.querySelector(this.blurAppElement);
    if (!appEle) {
      // eslint-disable-next-line no-console
      return console.warn('[LoadingDialog]', 'config.blurAppElement 配置无效');
    }
    this.addClass(appEle, 'xtool-element-dialog--login__blur');
    this.addClass(appEle, 'show-blur');
  }

  // 删除 blurAppElement 元素的 show-blur class
  private removeClassShowBlur() {
    if (!this.blurAppElement) return;
    const ele = document.querySelector(this.blurAppElement);
    if (!ele) return;
    ele.setAttribute(
      'class',
      (ele.getAttribute('class') || '').replace(/\bshow-blur\b/g, '').trim(),
    );
  }

  private addClass(ele: Element, cls: string) {
    const clsStr = ele.getAttribute('class') || '';
    if (!new RegExp(`\\b${cls}\\b`).test(clsStr)) {
      ele.setAttribute('class', `${clsStr} ${cls}`);
    }
  }
}

</script>
