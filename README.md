# xing-weapp-editor

> 开箱即用的小程序图文编辑组件

## 组件属性

属性名|类型|默认值|说明
---|---|---|---
image-upload-url|String|无|图片上传，必填，参考[wx.uploadFile](https://developers.weixin.qq.com/miniprogram/dev/api/network-file.html#wxuploadfileobject)
image-upload-name|String|无|图片上传，必填，参考[wx.uploadFile](https://developers.weixin.qq.com/miniprogram/dev/api/network-file.html#wxuploadfileobject)
image-upload-header|String|无|图片上传，参考[wx.uploadFile](https://developers.weixin.qq.com/miniprogram/dev/api/network-file.html#wxuploadfileobject)
image-upload-form-data|Object|无|图片上传，参考[wx.uploadFile](https://developers.weixin.qq.com/miniprogram/dev/api/network-file.html#wxuploadfileobject)
image-upload-key-chain|String|无|图片上传接口返回值中url字段的路径，如返回为`{ image : { url: 'http://xxx.jpg' } }`，则填`image.url`
output-type|String|html|输出的格式，`html`或`array`，参考[rich-text](https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html)
button-background-color|String|#409EFF|完成按钮的背景色
button-text-color|String|#fff|完成按钮的前景色
nodes|Array|无|初始内容的array形式，仅支持此组件输出的array，优先于HTML
html|String|无|初始内容的HTML形式，仅支持此组件输出的HTML
bindfinish|EventHandle|无|输出内容时触发，`event.detail = { content }`

## 代码示例

```xml
<!-- index.wxml -->
<xing-editor
  bindfinish="finish"
  output-type="html"
  image-upload-url="http://localhost:3000/upload"
  image-upload-name="image"
  image-upload-key-chain="image.url"
  html="{{html}}"/>
```

```javascript
//index.js
Page({
  data: {
    html: '<p class="xing-p">123124<br><br>123124123<br><br><br>324123</p>' +
    '<img class="xing-img" style="width: 100%" src="http://localhost:3000/static/73e95bd90f005.png" _height="0.5743348982785602" _uploaded="true"></img>' +
    '<p class="xing-p">333</p>' + 
    '<img class="xing-img" style="width: 100%" src="http://localhost:3000/static/2dab4bd82f879.png" _height="1.2095588235294117" _uploaded="true"></img>',
  },

  finish: function (e) {
    console.log(e.detail.content);
  },
})
```

```javascript
{
  "usingComponents": {
    "xing-editor": "/components/xing-editor"
  }
}
```