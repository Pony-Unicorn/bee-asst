Bee Asst

缩写 Ba ，也代表了学士学位
笔记、个人任务、书签(M)等工具，基于 nextjs、tailwindcss、cloudflare pages、cloudflare worker 开发

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
  `user:user-unique={user-unique:"",name:"pony",psw:"jsf82sdfs", token:"oifdwsdq"}`
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

- 书签搜索
- 书签数据存储压缩
- 登陆添加过期时间
- 添加版本号
- 界面 UI 的优化
  - 自动获取网页标题
  - 头像占位符
- 整理最佳实践
  - 互联网的第一课书签
- 添加 og 开放协议
- 筛选：添加只包含
- 上一次的筛选保存到本地
- 弹窗绑定 esc 快捷键，关闭按钮在右上方
- 隐藏书签

## 特点

- 书签分为三部分：单标签，组合标签，视图

## Think

- 压缩字符串方案
- 标签和组合标签的顺序
- 分享 /share?u=user-unique&combo_tag=id1,id2,id3
  -

## 感谢

- 网站图标使用 https://icon.horse/ 服务，非常感谢
