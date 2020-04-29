---
title: icarus主题的改造以及一些备份问题
top: 0
date: 2020-01-31 19:22:02
tags: hexo
---
# 最近的一些改造

## 把三列改成了一列
其实蛮简单，只要注释掉那些多余的`widgets`就行了,这样看着比较简洁一些
## 添加了置顶的功能
参考文章：[Hexo | 两个你可能会用到的icarus主题配置 ](https://susreal.coding.me/article/2019/hexo-theme-icarus-2/)
<!--more-->
**备份**

`/⁨node_modules⁩/hexo-generator-index⁩/lib⁩/generator.js` 文件里
```js
'use strict';

const pagination = require('hexo-pagination');

module.exports = function(locals) {
  const config = this.config;
  const posts = locals.posts.sort(config.index_generator.order_by);
  const paginationDir = config.pagination_dir || 'page';
  const path = config.index_generator.path || '';
posts.data = posts.data.sort(function(a, b) {
if(a.top && b.top) {
    if(a.top == b.top) return b.date - a.date;
    else return b.top - a.top;
}
else if(a.top && !b.top) {
    return -1;
}
else if(!a.top && b.top) {
    return 1;
}
else return b.date - a.date;
});

  return pagination(path, posts, {
    perPage: config.index_generator.per_page,
    layout: ['index', 'archive'],
    format: paginationDir + '/%d/',
    data: {
      __index: true
    }
  });
};
```

就这处需要备份，其余的都已经上传到github上了🎉
## 添加了阅读统计
同样在上面的教程里有

