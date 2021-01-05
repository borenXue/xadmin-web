import { Module } from 'vuex';
import appRouter, {
  MyRouteConfig, authRouteList, ComponentLayout, ComponentEmptyLayout,
} from '@/router';

interface AuthRightItem {
  id: number
  code: string
  name: string
  url: string
  sortOrder: number
  icon?: string
  tip?: string
  parentId?: number
  children?: AuthRightItem[]
}

interface StateRouterModule {
  authRouters: MyRouteConfig[]
}

/**
 * 根据接口返回的权限列表 生成 前端最终所需的路由列表 - authRouteList - 不含不需要登录认证的路由
 * @param rightList
 * @param level 第几级, 从 1 开始
 */
export function generateRouterListByRightList(rightList: AuthRightItem[], level: number = 1): MyRouteConfig[] {
  const routeList:MyRouteConfig[] = [];
  for (const right of rightList) {
    if (!right.children) right.children = [];
    let component = authRouteList[right.code];

    // 没有子节点的权限项, 如果未设置 component 或 url 则被丢弃
    if (
      (right.children.length === 0)
      && (!component || !right.url)
    ) {
      console.warn('该权限项不存在, 或 url 未配置, 将被忽略: ', right);
      continue;
    }

    // 针对第一级目录 && 普通目录 设置专用的 component
    if (right.children.length > 0) {
      component = level === 1 ? ComponentLayout : ComponentEmptyLayout;
    }

    const children = generateRouterListByRightList(right.children || [], level + 1);

    // 当权限中有 子权限, 且生成的路由中没有子路由时: 直接忽略该项
    if (right.children.length > 0 && children.length === 0) continue;

    routeList.push({
      path: right.url,
      meta: {
        permission: right.code,
        title: right.name,
        icon: right.icon,
        sidebar: true,
      },
      component,
      children,
    });
  }
  return routeList;
}

/**
 * 自动修复 router 路由配置对象
 * 1、path 重置: 父path + 子path
 *    【已删除 - 配置权限的时候应配置全路径, 否则权限 move 操作会影响页面的访问地址】
 * 2、设置分组项的 redirect 设置 - 为子列表的第一个
 */
function autoFixRouterConfig(routerList: MyRouteConfig[], parentPath: string = '') {
  for (const item of routerList) {
    item.children = item.children || [];
    // // 1、修复 path
    // if (parentPath) {
    //   item.path = `${parentPath}/${item.path}`;
    //   item.path = item.path.replace(/\/{1,}/g, '/').replace(/\/$/, '');
    // }

    // 2、递归处理 children 子路由
    autoFixRouterConfig(item.children, item.path);

    // 3、修复 redirect: 依赖于子路由的 path 是否修复完成
    if (!item.redirect && item.children.length > 0) {
      item.redirect = item.children[0].path;
    }
  }

  return routerList;
}

const RouterModule: Module<StateRouterModule, any> = {
  state: {
    // 需要权限访问的路由数组 - 已过滤掉无权限的项目
    // 不包含 nonAuthRoute 列表
    authRouters: [],
  },
  mutations: {
    SET_AUTH_ROUTERS: (state, authRouters: MyRouteConfig[]) => {
      // 只有 auth-routers 为空时才处理, 否则忽略, 防止重复添加
      if (authRouters.length > 0 && state.authRouters.length === 0) {
        appRouter.addRoutes([
          { path: '*', redirect: '/404' },
          ...authRouters,
        ]);
        state.authRouters = authRouters;
      }
    },
  },
  actions: {
    /**
     * 生成最终使用的路由
     * @param userRightsList 接口返回的当前用户的权限数组
     */
    GenerateRouters({ commit }, rightList: AuthRightItem[] = []) {
      return new Promise((resolve) => {
        const authRouters = generateRouterListByRightList(rightList);
        commit('SET_AUTH_ROUTERS', autoFixRouterConfig(authRouters));
        resolve();
      });
    },
  },
};

export default RouterModule;
