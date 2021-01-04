# xadmin-web

<br/><br/>

### 简介

* 技术栈 - vue2、element-ui、typescript
* 代码存储 - [GitHub](https://github.com/xbr-overview/xadmin-web)
* CI自动化 - [阿里云效](https://flow.aliyun.com/pipelines/1214642/history)
* OSS 地址 - [阿里云OSS](https://oss.console.aliyun.com/bucket/oss-cn-hangzhou/xadmin-test/overview)
* 体验地址 - [xadmin.xueboren.cn](http://xadmin.xueboren.cn/)



<br/><br/>

### 本地快速启动

```bash
# 安装依赖
npm install

# 本地启动
npm start

# 构建测试环境
npm run build:test
# 构建线上环境
npm run build:online
```

### vue-cli configuration

* Babel && TypeScript && Router && Vuex && node-sass
* ESLint + Airbnb config && Lint on save && Lint and fix on commit
* Use class-style component syntax
* Use Babel alongside TypeScript
* Use history mode for router
* In dedicated config files

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### TODO

* 测试环境发布脚本 - 发布至阿里云 OSS 网站托管
* 功能细节测试
* 组件开发与优化
  * 开发 - 多行省略文本组件 - 仅超出时 tooltip 提示 && 支持自定义省略文案与样式(...)
  * 开发 - icon 组件: svg、图片、icon-symbol 支持
  * 优化 - SidebarController 组件支持初次设置时, 不展示动效
* 完善第三方库的 typescript 定义
  * segment-js
* axios 强依赖 0.18.1 版本, 寻找替代方案
* welcome 页面内部元素支持
