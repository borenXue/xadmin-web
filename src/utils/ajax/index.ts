import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import qs from 'qs';
import { showLoading, closeLoading } from '@/utils/loading';
import deleteRequestEmptyParams from './params-trim';
import LoginDialog from '@/components/dialog/login-dialog/index';
import RequestLoginEvent from '../RequestLoginEvent';

export enum LoadingType { All = 'ALL', Request = 'REQUEST', Response = 'RESPONSE', None = 'NONE' }
const myConfigDefault = {
  loading: LoadingType.None,
  minTime: 1000, // 最少 1 秒
  deleteParams: true,
  $startTime: 0,
  loginDialogWhile401: true,
  loginPageWhile401: false,
};


// 定义全局变量clearRequest，在route.js中要用到
export const clearRequest: {
  source: Partial<CancelTokenSource>
} = {
  source: {
    token: undefined,
    cancel: undefined,
  },
};
const source = axios.CancelToken.source();


const axiosInstance = axios.create({
  baseURL: process.env.base_api,
  timeout: process.env.ajax_timeout,
  withCredentials: true,
  paramsSerializer(params) {
    return qs.stringify(params, {
      arrayFormat: 'brackets',
    });
  },
  cancelToken: source.token,
});


// eslint-disable-next-line no-use-before-define
axiosInstance.interceptors.request.use(requestInterceptorFulfilled as any, requestInterceptorRejected);
// axiosInstance.interceptors.response.use(responseInterceptorFulfilled as any, responseInterceptorRejected);
// eslint-disable-next-line no-use-before-define
axiosInstance.interceptors.response.use(responseInterceptorFulfilled as any, responseInterceptorRejected);


export const httpGet = (url: string, params?: object, myCfg?: Partial<myConfigType>, axiosConfig?: AxiosRequestConfig) => {
  const config: MyAjaxConfig = {
    ...axiosConfig,
    method: 'get',
    url,
    params,
    myConfig: { ...myConfigDefault, ...myCfg },
  };
  return axiosInstance(config as AxiosRequestConfig);
};

export const httpPost = (url: string, params?: object, myCfg?: Partial<myConfigType>, axiosConfig?: AxiosRequestConfig) => {
  const config: MyAjaxConfig = {
    ...axiosConfig,
    method: 'post',
    url,
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
    myConfig: { ...myConfigDefault, ...myCfg },
  };
  return axiosInstance(config as AxiosRequestConfig);
};

export const httpDelete = (url: string, params?: object, myCfg?: Partial<myConfigType>, axiosConfig?: AxiosRequestConfig) => {
  const config: MyAjaxConfig = {
    ...axiosConfig,
    method: 'delete',
    url,
    params,
    headers: {
      'Content-Type': 'application/json',
    },
    myConfig: { ...myConfigDefault, ...myCfg },
  };
  return axiosInstance(config as AxiosRequestConfig);
};

export const httpPut = (url: string, params?: object, myCfg?: Partial<myConfigType>, axiosConfig?: AxiosRequestConfig) => {
  const config: MyAjaxConfig = {
    ...axiosConfig,
    method: 'put',
    url,
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
    myConfig: { ...myConfigDefault, ...myCfg },
  };
  return axiosInstance(config as AxiosRequestConfig);
};

export const httpPatch = (url: string, params?: object, myCfg?: Partial<myConfigType>, axiosConfig?: AxiosRequestConfig) => {
  const config: MyAjaxConfig = {
    ...axiosConfig,
    method: 'patch',
    url,
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
    myConfig: { ...myConfigDefault, ...myCfg },
  };
  return axiosInstance(config as AxiosRequestConfig);
};

function requestInterceptorFulfilled(config: MyAjaxConfig) {
  config.cancelToken = clearRequest.source.token;

  /* eslint-disable-next-line no-param-reassign */
  config.myConfig.$startTime = new Date().getTime();

  if ([LoadingType.All, LoadingType.Request].includes(config.myConfig.loading)) {
    showLoading();
  }

  if (config.myConfig.deleteParams) {
    deleteRequestEmptyParams(config);
  }

  return config;
}
function requestInterceptorRejected(error: any) { return error; }

function responseInterceptorFulfilled(response: any) {
  const config = response.config as MyAjaxConfig;

  function handleLoadingAndReturn() {
    if ([LoadingType.All, LoadingType.Response].includes(config.myConfig.loading)) {
      closeLoading();
    }
    if (!response.data.success) {
      throw new Error(response.data.info || '请求失败, 未返回失败原因');
    }
    return response;
  }

  if (!config.myConfig.minTime) return handleLoadingAndReturn();

  // 处理 minTime 参数
  const costTime = (new Date().getTime() - config.myConfig.$startTime);
  if (costTime >= config.myConfig.minTime) {
    return handleLoadingAndReturn();
  }
  // 实际用时小于 minTime 的处理
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      try {
        resolve(handleLoadingAndReturn());
      } catch (err) {
        reject(err);
      }
    }, config.myConfig.minTime - costTime);
  });
}
function responseInterceptorRejected(error: any) {
  // eslint-disable-next-line no-underscore-dangle
  if (!error.config && error.__CANCEL__) {
    return Promise.reject(new Error('request cancel'));
  }
  const config = error.config as MyAjaxConfig;

  function handleLoadingAndReturn() {
    if ([LoadingType.All, LoadingType.Response].includes(config.myConfig.loading)) {
      closeLoading();
    }
    if (error.response && error.response.status === 401) {
      if (config.myConfig.loginDialogWhile401) {
        LoginDialog({
          customClass: 'xadmin-login-dialog',
          blurAppElement: '#app',
          login: (userName, password, close, done) => {
            window.dispatchEvent(new RequestLoginEvent(userName, password, close, done));
          },
        });
      }
      if (config.myConfig.loginPageWhile401) {
        window.location.hash = '/login';
      }
      throw new Error('response code is 401');
    }
    throw error;
  }

  if (!config) return handleLoadingAndReturn();

  if (!config.myConfig.minTime) return handleLoadingAndReturn();

  // 处理 minTime 参数
  const costTime = (new Date().getTime() - config.myConfig.$startTime) / 1000;
  if (costTime >= config.myConfig.minTime) {
    return handleLoadingAndReturn();
  }
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      try {
        resolve(handleLoadingAndReturn());
      } catch (err) {
        reject(err);
      }
    }, config.myConfig.minTime - costTime);
  });
}


type myConfigType = {
  /**
   * 请求的 loading 处理
   */
  loading: LoadingType,
  /**
   * 请求最少要耗时 minTime ms 后才可以返回
   */
  minTime: number,
  /**
   * 是否删除请求参数中为 undefined 或 null 的参数
   */
  deleteParams: boolean,
  /**
   * 不需要设置, 内部的一个变量
   */
  $startTime: number

  /**
   * 接口 401 时是否展示登录弹窗
   */
  loginDialogWhile401: boolean,
  /**
   * 接口 401 时是否跳转登录页面
   */
  loginPageWhile401: boolean,
}

export interface MyAjaxConfig extends AxiosRequestConfig {
  myConfig: myConfigType
}
