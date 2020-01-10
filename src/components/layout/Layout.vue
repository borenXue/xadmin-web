<template>
  <div class="app-layout">
    <Navbar />

    <div class="layout-content">
      <Sidebar :permission-router-list="authRouters" />

      <div class="layout-main">
        <transition name="fade" mode="out-in">
          <router-view :key="key"/>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import Navbar from './inner/Navbar.vue';
import Sidebar from './inner/Sidebar.vue';

@Component({
  components: { Navbar, Sidebar },
  computed: {
    ...mapGetters(['authRouters']),
  },
})
export default class Layout extends Vue {
  get key() {
    return +new Date();
  }
}
</script>

<style lang="scss" scoped>
.app-layout {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .layout-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    .layout-main {
      flex: 1;
      padding: 16px 20px;
      min-width: 368px;

      box-sizing: border-box;
    }
  }
}
</style>
