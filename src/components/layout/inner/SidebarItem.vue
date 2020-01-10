
<template>
  <!-- 有子节点 -->
  <el-submenu :index="item.path" v-if="item.children && item.children.length > 0">
    <template slot="title">
      <i v-if="item.meta.icon" :class="item.meta.icon"/>
      <span>{{ item.meta.title }}</span>
    </template>

    <template v-for="child in item.children">
      <sidebar-item :item="child" :key="child.path"/>
    </template>
  </el-submenu>

  <!-- 没有子节点 -->
  <router-link v-else :key="item.path" :to="item.path">
    <el-menu-item :index="item.path">
      <i v-if="item.meta && item.meta.icon" :class="item.meta.icon" />
      <span>{{ item.meta.title }}</span>
    </el-menu-item>
  </router-link>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
export default class SidebarItem extends Vue {}
</script>

<style lang="scss" scoped>
.el-submenu {
  ::v-deep .el-submenu__title {
    display: flex;
    align-items: center;
    padding-right: 10px;
    padding-left: 10px !important;
    transition: linear 300ms all;
    i:first-child {
      margin-right: 0;
      max-width: 30px;
      width: 30px;
      min-width: 20px;
      text-align: center;
    }
    span {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    i:last-child {
      margin-top: 0px;
      position: initial;
      max-width: 30px;
      width: 30px;
      min-width: 20px;
      text-align: center;
      transition: linear 100ms width;
    }
  }

  ::v-deep .el-menu-item {
    padding-right: 15px;
  }

  ::v-deep .el-menu li span {
    width: 100%;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.el-submenu.is-active {
  ::v-deep .el-submenu__title {
    color: #409EFF;
    i {
      color: #409EFF;
    }
  }
  &.is-opened {
    ::v-deep .el-submenu__title {
      color: #303133;
      i {
        color: #909399;
      }
    }
  }
}
</style>
