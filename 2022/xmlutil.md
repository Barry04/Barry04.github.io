---
layout: default
title: XmlUtil.readObjectFromXml的坑及解决方法
date: 2022-02-18
tag: Java / Hutool
redirect_from:
  - /2022/02/18/XmlUtil/
---

# Java辅助类工具箱Hutool

**关于Hutool的使用参考官方文档 [官方文档](https://hutool.cn/)**

# XML工具-XmlUtil

![](https://img-blog.csdnimg.cn/8c196d39d6df4980bf833284a538ba94.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6KKr6aOO5Lyk6L-H,size_20,color_FFFFFF,t_70,g_se,x_16)

*XmlUtil工具前面几个用的都挺好的，就是关于XML与对象的转换那里，我懵逼了。*
**readObjectFromXml 从XML中读取对象。**
这个介绍就有点敷衍了吧，用的时候果然我就出行问题。

# 上代码，描述问题

```java
Student student = new Student("asd","asd");
Document document = XmlUtil.beanToXml(student);
String str = XmlUtil.toStr(document);
Student student2 = XmlUtil.readObjectFromXml(str);
```

然后就报错了

![](https://img-blog.csdnimg.cn/e09a015cdd2448d788da5c8cbfb403d3.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6KKr6aOO5Lyk6L-H,size_20,color_FFFFFF,t_70,g_se,x_16)

# 解决方案

 就不用 readObjectFromXml(）
*官方给的解释*
![](https://img-blog.csdnimg.cn/57ecf640ca1d42438064af2d62c44449.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6KKr6aOO5Lyk6L-H,size_20,color_FFFFFF,t_70,g_se,x_16)

![](https://img-blog.csdnimg.cn/70837473cfb8440a9d8124c5c2b298fd.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6KKr6aOO5Lyk6L-H,size_20,color_FFFFFF,t_70,g_se,x_16)

通过下面的操作去一个一个读取，或者是用xmlToMap的方法。。

![](https://img-blog.csdnimg.cn/7c75a46581014b229cbe899ff9096764.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6KKr6aOO5Lyk6L-H,size_20,color_FFFFFF,t_70,g_se,x_16)

解决：

```java
Student student = new Student("asd","asd");
Document document = XmlUtil.beanToXml(student);
Element root = XmlUtil.getRootElement(document);
student2.setName(XmlUtil.elementText(root, "Name", null));
```
