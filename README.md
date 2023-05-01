Bee Asst

笔记、个人任务、书签等工具，基于 nextjs、tailwindcss、cloudflare pages、cloudflare worker 开发

## Install

```bash
yarn
```

## Getting Started

First, run the development server:

```bash
yarn dev
```

## 说明

- 支持平台：pc 网页并且适配移动端、pwa 书签要支持浏览器插件
- 工具 1: 卡片式笔记，简单笔记。参考 flomo
- 工具 2: 个人任务、个人看板。参考 板栗
- 工具 3: 浏览器书签管理，类似自己的导航页
  - 参考 https://withpinbox.com/explore http://demo.onenav.top/ https://b.lucq.fun/#/tags
  - 功能：稍后阅读、自动获取 logo、私密书签、一键打开文件夹内所有书签
  - 特色：多 tag 书签、标签可点击筛选,tag 颗粒要细化，根据 tag 生成视图（tag 的组合）
- 工具 4: 其他实用小工具，例如 rss 阅读等，仔细考虑，或者搭建二级项目，进行跳转

## 数据表

- 所有数据处理都在前端，服务器只进行存储
- 用户表
  `user:user-unique={user-unique:"",name:"pony",psw:"jsf82sdfs"}`
- 笔记：tags 表
  `note:user-unique:tags={tagname:{id:1111,count:1,index:1,top:0}}`
- 笔记：笔记表
  `note:user-unique:tagid:nid={}`
- 书签：书签表

```bookmark:user-unique={
    metadata: {version: "0.0.1"},
    tags: ["通用","官网","博客资料","工具","新闻资讯","区块链","前端","后端","框架","游戏"],
    view: ["4,5,6,2","0,1,6,2","3,5,9"],
    items: [{i:'ssdfsdfsd',n: "百度", u: "www.baidu.com", t:"1,3,4,6,9",ut:1682428883, ct: 1682428883}]
  }
```

## To-do

- 本地调试开发
- 书签数据存储压缩
- 自动保存和同步，保存：延迟同步和立即同步
- 账户体系、登陆登出，使用数据库实现，放到 cookie 中
- 界面 UI 的优化
