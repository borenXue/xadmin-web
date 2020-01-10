import { Loading } from 'element-ui';

let loadingInstance: any = null;
export function showLoading() {
  loadingInstance = Loading.service({
    lock: true,
    text: '正在请求...',
    customClass: 'xadmin-ele-loading',
    spinner: 'el-icon-loading',
    background: 'rgba(8, 8, 8, 0.3)',
  });
}

export function closeLoading() {
  if (loadingInstance) loadingInstance.close();
}
