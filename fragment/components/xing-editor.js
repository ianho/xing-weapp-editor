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

    buttonBackgroundColor: {
      type: String,
      value: '#409EFF',
    },

    buttonTextColor: {
      type: String,
      value: '#fff',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    windowHeight: 0,
    base64: false,
    nodes: [],
    nodesData: [],
    textareaFocus: null,
  },

  attached: function () {
    if (!this.properties.imageUploadUrl) {
      this.setData({
        base64: true,
      })
    }
    const { windowHeight } = wx.getSystemInfoSync();
    this.setData({
      windowHeight,
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    updateNodes: function (e) {
      const nodesData = this.data.nodesData;
      let nodes = this.data.nodes;
      nodes.forEach((node, index) => {
        if (node.name === 'p') {
          node.children[0].text = nodesData[index];
        }
        // if (node.name === 'img') {
        //   node.attrs.src = nodesData[index];
        // }
      })
      this.setData({
        nodes,
      })
    },

    addText: function (e) {
      this.updateNodes();
      const index = e.currentTarget.dataset.index;
      const node = {
        name: 'p',
        attrs: {
          class: 'xing-p',
        },
        children: [{
          type: 'text',
          text: ''
        }]
      }
      let nodes = this.data.nodes;
      let nodesData = this.data.nodesData;
      nodes.splice(index + 1, 0, node);
      nodesData.splice(index + 1, 0, '');
      this.setData({
        nodes,
        nodesData,
        textareaFocus: index + 1,
      })
    },

    addImage: function (e) {
      this.updateNodes();
      const index = e.currentTarget.dataset.index;
      wx.chooseImage({
        success: res => {
          const tempFilePath = res.tempFilePaths[0];
          wx.getImageInfo({
            src: tempFilePath,
            success: res => {
              console.log(res);
              const node = {
                name: 'img',
                attrs: {
                  class: 'xing-img',
                  src: tempFilePath,
                  _height: res.height / res.width,
                },
              }
              let nodes = this.data.nodes;
              let nodesData = this.data.nodesData;
              nodes.splice(index + 1, 0, node);
              nodesData.splice(index + 1, 0, tempFilePath);
              this.setData({
                nodes,
                nodesData,
              })
            }
          })
        },
      })
    },

    deleteNode: function (e) {
      const index = e.currentTarget.dataset.index;
      let nodes = this.data.nodes;
      let nodesData = this.data.nodesData;
      nodes.splice(index, 1);
      nodesData.splice(index, 1);
      this.setData({
        nodes,
        nodesData,
      })
    },

    onTextareaInput: function (e) {
      const index = e.currentTarget.dataset.index;
      let nodesData = this.data.nodesData;
      nodesData[index] = e.detail.value;
      this.setData({
        nodesData,
      })
    },
  }
})
