// components/xing-editor.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //图片上传相关属性，参考wx.uploadFile
    imageUploadUrl: String,
    imageUploadName: String,
    imageUploadHeader: Object,
    imageUploadFormData: Object,
    imageUploadKey: String, //例：'image.url'

    //是否在选择图片后立即上传
    uploadImageWhenChoose: {
      type: Boolean,
      value: false,
    },

    //内容输出格式，参考rich-text组件，默认为节点列表
    outputType: {
      type: String,
      value: 'array',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    windowHeight: 0,
  },

  attached: function () {
    const { windowHeight } = wx.getSystemInfoSync();
    this.setData({
      windowHeight,
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
