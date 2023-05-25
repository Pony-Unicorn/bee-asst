Bee Asst

缩写 Ba ，也代表了学士学位
笔记(N)、任务(T)、书签(M)等工具，基于 nextjs、tailwindcss、cloudflare pages、cloudflare worker 开发

## Install

```bash
yarn
```

## Getting Started

First, run the development server:

```bash
yarn dev
```

## 功能

- 支持平台
  - pc 网页、手机网页、pwa、chrome 浏览器插件
- 玩转 emoji 表情，尽量使用 emoji 表情作为 icon
- 工具 1: 卡片式笔记，简单笔记。参考 flomo
- 工具 2: 个人任务、个人看板。参考 板栗、或者简化任务
- 工具 3: 浏览器书签管理，类似自己的导航页
  - 参考 https://withpinbox.com/explore http://demo.onenav.top/ https://b.lucq.fun/#/tags
- 工具 4: 其他实用小工具，仔细考虑，或者搭建二级项跳转
  - rss 阅读
  - 文字转成二维码、可加密的

## To-do

- 书签
  - 功能: 书签搜索
  - 功能: 标签栏目可拖动大小，有最大限制
  - 功能: 登陆添加过期时间
  - 功能: 绑定快捷键
    - 搜索绑定 cmd + k (macOS) or ctrl + k (Linux/Windows)
    - 登录等、确定绑定回车键
  - 功能: 私密书签
  - 功能: 分享 /share?u=user-unique&combo_tag=id1,id2,id3
  - 功能: 添加 og 开放协议
  - 功能: 设置
    - 每日备份
    - 书签页面宽度，待定
  - 功能: 谷歌或者百度搜索研究
  - UI: 书签居中
  - UI: 所有关闭按钮在右上方
  - 筛选: 包含和只包含
  - 筛选: 标签和组合标签的顺序
  - 最佳实践:
    - 互联网的第一课书签
    - 标签如何分类，中文最多四个字，推荐两个字。英文: 推荐 5 字符，最长 10 个字符。行业:工具、文档
  - 思考: 数据的安全如何保证

## 感谢

- 网站图标使用 https://icon.horse/ 服务，非常感谢
