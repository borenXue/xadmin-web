<template>
  <el-breadcrumb class="layout-breadcrumb" separator-class="el-icon-arrow-right">

    <transition-group name="my-breadcrumb" tag="p">

      <el-breadcrumb-item v-for="(item, idx) in breadcrumbList" :key="item.path">
        <span v-if="item === '/welcome' || idx === breadcrumbList.length - 1">
          {{ item.label }}
        </span>
        <router-link v-else tag="a" :to="item.path">
          {{ item.label }}
        </router-link>
      </el-breadcrumb-item>

    </transition-group>

  </el-breadcrumb>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteRecord } from 'vue-router';

@Component({})
export default class BreadCrumb extends Vue {
  get breadcrumbList() {
    const list: any[] = [];
    this.$route.matched.forEach((item: RouteRecord) => {
      if (item.meta && item.meta.title) {
        list.push({
          label: item.meta.title,
          path: item.path,
        });
      }
    });
    if (list.length > 0 && list[0].path !== '/welcome') {
      list.unshift({
        label: '首页',
        path: '/welcome',
      });
    }
    return list;
  }
}
</script>

<style lang="scss" scoped>
.layout-breadcrumb {
  display: inline-block;
  position: relative;
  top: -2.5px;

  /*fade*/
  $time: 0.7s;
  .my-breadcrumb-enter-active,
  .my-breadcrumb-leave-active {
    transition: all $time;
  }
  .my-breadcrumb-enter,
  .my-breadcrumb-leave-active {
    opacity: 0;
    transform: translateX(20px);
  }
  .my-breadcrumb-move {
    transition: all $time;
  }
  .my-breadcrumb-leave-active {
    position: absolute;
    white-space: nowrap;
  }

  ::v-deep .el-breadcrumb__item {
    .el-breadcrumb__inner {
      a, span {
        color: #97a8be;
        font-weight: 500;
        cursor: pointer;
      }
    }
    i.el-breadcrumb__separator {
      color: #c0c4cc;
    }
    &:last-child {
      .el-breadcrumb__inner {
        span {
          color: #424242;
          cursor: text;
        }
      }
    }
  }
}
</style>
