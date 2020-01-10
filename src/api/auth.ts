import {
  httpPost, httpPatch, httpGet, httpPut, httpDelete, LoadingType,
} from '@/utils/ajax/index';

/**
 * 登录、登出、登录状态检查、修改密码
 */
export const login = (userName: string, password: string) => httpPost('/auth/login', { loginName: userName, password }, { loading: LoadingType.All });
export const logout = () => httpPost('/auth/logout', undefined, { loading: LoadingType.All });
export const isLogin = () => httpPost('/auth/is-login', undefined, {
  loginDialogWhile401: false,
  loginPageWhile401: true,
  loading: LoadingType.All,
});

export const changePassword = (password: string, oldPassword: string) => httpPatch('/auth/password', { password, oldPassword }, { loading: LoadingType.All });

/**
 * 权限管理页面
 */
export const rightList = (params?: any) => httpGet('/auth/right', params);
export const rightSave = (params: any) => (!params.id ? httpPost('/auth/right', params) : httpPut('/auth/right', params));
export const rightEnable = (id: number) => httpPatch(`/auth/right/${id}/enable`);
export const rightDisable = (id: number) => httpPatch(`/auth/right/${id}/disable`);
export const rightDelete = (id: number) => httpDelete(`/auth/right/${id}`);
export const rightMove = (
  movedId: number,
  referenceId: number,
  type: 'before' | 'after',
) => httpPatch('/auth/right/move', { movedId, referenceId, type });

/**
 * 角色管理页面
 */
export const roleList = (params?: any) => httpGet('/auth/role', params);
export const roleSave = (params: any) => (!params.id ? httpPost('/auth/role', params) : httpPut('/auth/role', params));
export const roleEnable = (id: number) => httpPatch(`/auth/role/${id}/enable`);
export const roleDisable = (id: number) => httpPatch(`/auth/role/${id}/disable`);
export const roleDelete = (id: number) => httpDelete(`/auth/role/${id}`);

/**
 * 用户管理页面
 */
export const userList = (params?: any) => httpGet('/auth/user', params);
export const userSave = (params: any) => (!params.id ? httpPost('/auth/user', params) : httpPut('/auth/user', params));
export const userEnable = (id: number) => httpPatch(`/auth/user/${id}/enable`);
export const userDisable = (id: number) => httpPatch(`/auth/user/${id}/disable`);
export const userDelete = (id: number) => httpDelete(`/auth/user/${id}`);
