<template>
  <div class="layout-navbar">

    <SidebarController :is-opened="sidebar.opened" @toggle="toggleSideBar" />

    <div class="navbar-main">
      <BreadCrumb />
    </div>

    <div class="avatar-box">
      <el-dropdown class="avatar-container" trigger="hover">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="userLogo">
          <i class="el-icon-caret-bottom"/>
        </div>

        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <router-link exact class="router-link-go-welcome" to="/welcome">
            <el-dropdown-item :disabled="isExactHome">回到主页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="changePassword" style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="logout" style="display:block;">安全登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BreadCrumb from './BreadCrumb.vue';
import SidebarController from '@/components/button/SidebarController.vue';

@Component({
  components: { BreadCrumb, SidebarController },
  computed: {
    ...mapGetters(['sidebar', 'userLogo']),
  },
})
export default class LayoutNavbar extends Vue {
  get isExactHome() {
    return this.$route.path === '/welcome';
  }

  async toggleSideBar() {
    await this.$store.dispatch('TOOGGLE_SIDEBAR_OPENED');
  }

  async logout() {
    await this.$store.dispatch('ActionLogout');
    this.$router.push('/login');
  }

  changePassword() {
    this.$changePassword();
  }
}
</script>

<style lang="scss" scoped>
.layout-navbar {
  height: 50px;
  overflow: hidden;
  background: white;
  padding-right: 20px;
  padding-left: 5px;

  box-shadow: rgba(0, 0, 0, 0.08) 0 1px 10px 0px;
  z-index: 1;

  display: flex;
  align-items: center;

  .navbar-main {
    flex: 1;
    margin: 0 20px 0 10px;
    height: 100%;
    line-height: 100%;
    display: flex;
    align-items: center;
  }
  .avatar-box {
    $imgWidth: 30px;
    img {
      width: $imgWidth;
      height: $imgWidth;
      border-radius: $imgWidth;
      margin-right: 10px;
    }

    .avatar-wrapper {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
  }
}
</style>
