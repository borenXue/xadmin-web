<template>
  <div class="layout-sidebar" :class="{'not-collapse': isCollapse, 'collapse': !isCollapse}">
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse">

      <template v-for="item in permissionRouterList">

        <SidebarItem :item="item" :key="item.path"/>

      </template>

    </el-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import SidebarItem from './SidebarItem.vue';

@Component({
  components: { SidebarItem },
  props: {
    permissionRouterList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters(['sidebar']),
  },
})
export default class LayoutSidebar extends Vue {
  get isCollapse() {
    return !(this as any).sidebar.opened;
  }
}
</script>

<style lang="scss" scoped>
.layout-sidebar {
  background: white;
  overflow-y: scroll;
  overflow-x: hidden;
  // width && padding-left
  transition: linear 300ms all;
  &.collapse {
    // min-width: 140px;
    min-width: 200px;
  }
  &.not-collapse {
    ::v-deep .el-submenu__title {
      padding-left: 0;
      i:first-child {
        width: 100%;
      }
    }
  }

  ::v-deep .el-menu {
    border-right: none;
  }

  & > .el-menu {
    width: 200px;
    max-width: 100%;
    &.el-menu--collapse {
      width: 34px;
    }

    &.el-menu--collapse {
      ::v-deep .el-submenu__title {
        padding: 0 !important;
        text-align: center;
        span {
          padding: 0;
          width: 0;
        }
      }
    }
  }
}
</style>
