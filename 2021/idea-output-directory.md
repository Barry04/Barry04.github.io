---
layout: default
title: 解决IDEA Error:Output directory is not specified
redirect_from:
  - /2021/04/06/解决IDEA-Error-Output-directory-is-not-specified/
---

## 报错原因

## 解决方法

java: 写入servlet.servlet时出错: Output directory is not specified
初学JavaWeb的使用了servlet的时候出现报的错。。
其意思就是没有指定输出的路径，是你建Module时候并没有指定。
本人使用的中文的IntelliJ IDEA2019.3.2。。

  根据下面的图片步骤就能解决了。 

![](https://img-blog.csdnimg.cn/20200325195727762.png)

## File> Project Structure…> Project>Project compiler output

![](https://img-blog.csdnimg.cn/2020032519545355.png)
