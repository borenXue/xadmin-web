<template>
  <section class="layout-view-main">

    <Navbar />

    <div class="layout-content-wrapper">
      <Sidebar />

      <transition name="fade" mode="out-in">
        <router-view :key="key"/>
      </transition>
    </div>

  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';

@Component({
  components: { Navbar, Sidebar },
})
export default class ViewMain extends Vue {
  get key() {
    return +new Date();
  }
}
</script>

<style lang="scss" scoped>

</style>
