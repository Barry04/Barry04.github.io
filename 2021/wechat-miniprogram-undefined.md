---
layout: default
title: 微信小程序 Cannot read property 'xxx' of undefined
date: 2021-04-06
tag: 微信
redirect_from:
  - /2021/04/06/Cannot read property ‘xxx‘ of undefined/
---

# 一个function无法调用另一个function看看这里

```javascript
var that = this
     wx.getLocation({
       type: 'wgs84',
       success:function (res) {
         that.setData({
           location_id:res.longitude+','+res.latitude

         })
       },

      })
      that.click() //无法调用
```

## 报错：

*Cannot read property ‘text’ of undefined;at pages/weather/weather onLoad function;at api request success callback function TypeError: Cannot read property ‘text’ of undefined*

![](https://img-blog.csdnimg.cn/20210325190059512.png)

就是说属性text没有声明，肯定是申明的。*at api request success callback function* 这里说明是在这里没有申明。然后我的直觉是生命周期的问题，因为我人工模拟调用都能成功，然后我去查找官方文档。

## 原因

![](https://img-blog.csdnimg.cn/2021032519071525.png)

然后就找到原因了。它这要结束回调才能正常使用另一个function。

## 解决方法：将上面的代码修改如下

```javascript
onLoad: function (options) {
      //console.log("load")
      var that = this
      wx.getLocation({
        type: 'wgs84',
        success:function (res) {
          that.setData({
            location_id:res.longitude+','+res.latitude

          })
        },
        complete:function(e){
          that.click()
        }
       })

    },
```

[微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html)
