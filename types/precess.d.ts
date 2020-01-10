/* eslint-disable camelcase */

declare namespace NodeJS {
  interface Process {
    env: {
      /**
       * 运行环境标识
       *    development: 本地
       *    test: 测试环境
       *    online: 线上环境
       */
      NODE_ENV: 'development' | 'test' | 'online',
      /**
       * 接口 API 的前缀
       */
      base_api: string,
      /**
       * vue-router 的 base 配置
       */
      web_prefix_url: string,
      /**
       * 超时时间, 单位毫秒
       */
      ajax_timeout: number,

      /**
       * vue-router 的路由模式
       */
      router_mode: 'hash' | 'history' | 'abstract',
    }
  }
}
