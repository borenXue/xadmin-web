import Vue, { AsyncComponent } from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

export const ComponentLayout = () => import('@/components/layout/Layout.vue');
export const ComponentEmptyLayout = () => import('@/components/layout/EmptyLayout.vue');

export interface MyAuthRouteConfig {
  /**
   * 权限名: 对应的组件
   */
  [key: string]: AsyncComponent
}

export const authRouteList: MyAuthRouteConfig = {
  auth_user: () => import('@/views/auth/user.vue'),
  auth_role: () => import('@/views/auth/role.vue'),
  auth_right: () => import('@/views/auth/right.vue'),
};

export interface MyRouteConfig extends RouteConfig {
  meta?: {
    /**
     * 权限 code - 用于区分不同页面, eg: 多页面共用一个 view
     *  why: 前端硬编码 && 接口已设计为不可更新
     * 切勿使用 url 来区分不同页面: url 可在权限设置页面修改
     */
    permission?: string,
    /**
     * 页面标题
     */
    title: string,
    /**
     * 左侧栏图标
     */
    icon?: string,
    /**
     * 是否在左侧栏中展示, 默认为 true
     */
    sidebar?: boolean
  },
  /**
   * 子路由
   */
  children?: MyRouteConfig[]
}

// 可直接访问, 不需要登录 && 也不需要请求接口
const nonAuthRouteList: MyRouteConfig[] = [
  {
    path: '/404',
    meta: { sidebar: false, title: '404' },
    component: () => import('@/views/non-auth/404.vue'),
  },
  {
    path: '/login',
    meta: { sidebar: false, title: '登录' },
    component: () => import('@/views/non-auth/Login.vue'),
  },
  // 默认 404 配置
  // 刷新页面时, 会直接匹配成 404, 而不是走的 beforeEach 的逻辑, 未调用 is-login 来判断
  // 应在 登录成功后生成 router 的时候, 再动态添加进去
];

// 可直接访问, 不需要登录 但需要请求接口
const localAuthRouteList: MyRouteConfig[] = [
  {
    path: '/',
    meta: { sidebar: false, title: '' },
    redirect: '/welcome',
    component: ComponentLayout,
    children: [
      {
        path: '/welcome',
        meta: { sidebar: false, title: '首页' },
        component: () => import('@/views/non-auth/Welcome.vue'),
      },
    ],
  },
];

export default new VueRouter({
  mode: process.env.router_mode,
  base: process.env.web_prefix_url,
  routes: [
    ...nonAuthRouteList,
    ...localAuthRouteList,
  ],
});
