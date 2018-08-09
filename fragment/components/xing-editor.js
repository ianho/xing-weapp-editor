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
    imageUploadKeyChain: String, //例：'image.url'

    //是否在选择图片后立即上传
    // uploadImageWhenChoose: {
    //   type: Boolean,
    //   value: false,
    // },

    //内容输出格式，参考rich-text组件，默认为节点列表
    outputType: {
      type: String,
      value: 'html',
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
    nodeList: [],
    textBufferPool: [],
    textareaFocus: null,
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
    /**
     * 事件：添加文本
     */
    addText: function (e) {
      this.writeTextToNode();
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
      const nodeList = this.data.nodeList;
      const textBufferPool = this.data.textBufferPool;
      nodeList.splice(index + 1, 0, node);
      textBufferPool.splice(index + 1, 0, '');
      this.setData({
        nodeList,
        textBufferPool,
        textareaFocus: index + 1,
      })
    },

    /**
     * 事件：添加图片
     */
    addImage: function (e) {
      this.writeTextToNode();
      const index = e.currentTarget.dataset.index;
      wx.chooseImage({
        success: res => {
          const tempFilePath = res.tempFilePaths[0];
          wx.getImageInfo({
            src: tempFilePath,
            success: res => {
              const node = {
                name: 'img',
                attrs: {
                  class: 'xing-img',
                  style: 'width: 100%',
                  src: tempFilePath,
                  _height: res.height / res.width,
                },
              }
              let nodeList = this.data.nodeList;
              let textBufferPool = this.data.textBufferPool;
              nodeList.splice(index + 1, 0, node);
              textBufferPool.splice(index + 1, 0, tempFilePath);
              this.setData({
                nodeList,
                textBufferPool,
              })
            }
          })
        },
      })
    },

    /**
     * 事件：删除节点
     */
    deleteNode: function (e) {
      this.writeTextToNode();
      const index = e.currentTarget.dataset.index;
      let nodeList = this.data.nodeList;
      let textBufferPool = this.data.textBufferPool;
      nodeList.splice(index, 1);
      textBufferPool.splice(index, 1);
      this.setData({
        nodeList,
        textBufferPool,
      })
    },

    /**
     * 事件：文本输入
     */
    onTextareaInput: function (e) {
      const index = e.currentTarget.dataset.index;
      let textBufferPool = this.data.textBufferPool;
      textBufferPool[index] = e.detail.value;
      this.setData({
        textBufferPool,
      })
    },

    /**
     * 事件：提交内容
     */
    onFinish: function (e) {
      wx.showLoading({
        title: '正在保存',
      })
      this.writeTextToNode();
      this.handleOutput();
    },

    /**
     * 方法：将缓冲池的文本写入节点
     */
    writeTextToNode: function (e) {
      const textBufferPool = this.data.textBufferPool;
      const nodeList = this.data.nodeList;
      nodeList.forEach((node, index) => {
        if (node.name === 'p') {
          node.children[0].text = textBufferPool[index];
        }
      })
      this.setData({
        nodeList,
      })
    },

    /**
     * 方法：将节点转为HTML
     */
    nodeListToHTML: function () {
      const nodeList = this.data.nodeList;
      const html = nodeList.map(node => {
        if (node.name === 'p') {
          return `<p class="xing-p">${node.children[0].text}</p>`;
        }
        if (node.name === 'img') {
          return `<img class="xing-img" style="width: 100%" src="${node.attrs.src}" />`;
        }
        return '';
      }).join('');
      return html;
    },

    /**
     * 方法：上传图片
     */
    uploadImage: function (node) {
      return new Promise(resolve => {
        let options = {
          filePath: node.attrs.src,
          url: this.properties.imageUploadUrl,
          name: this.properties.imageUploadName,
        }
        if (this.properties.imageUploadHeader) {
          options.header = this.properties.imageUploadHeader;
        }
        if (this.properties.imageUploadFormData) {
          options.formData = this.properties.imageUploadFormData;
        }
        options.success = res => {
          const keyChain = this.properties.imageUploadKeyChain.split('.');
          let url = JSON.parse(res.data);
          keyChain.forEach(key => {
            url = url[key];
          })
          node.attrs.src = url;
          node.attrs._uploaded = true;
          resolve();
        }
        wx.uploadFile(options);
      })
    },

    /**
     * 方法：处理节点，递归
     */
    handleOutput: function (index = 0) {
      let nodeList = this.data.nodeList;
      if (index >= nodeList.length) {
        wx.hideLoading();
        if (this.properties.outputType.toLowerCase() === 'array') {
          this.triggerEvent('finish', { content: this.data.nodeList });
        }
        if (this.properties.outputType.toLowerCase() === 'html') {
          this.triggerEvent('finish', { content: this.nodeListToHTML() });
        }
        return;
      }
      const node = nodeList[index];
      if (node.name === 'img' && !node.attrs._uploaded) {
        this.uploadImage(node).then(() => {
          this.handleOutput(index + 1)
        });
      } else {
        this.handleOutput(index + 1);
      }
    },
  }
})
