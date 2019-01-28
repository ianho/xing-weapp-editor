const app = getApp()

Page({
  data: {
  },

  onLoad: function () {
    this.setData({
      html: '<p class="xing-p">不谈琐碎的细节，突出主题，颜色运用。这些都是行为，这些行为是纹身师的能力表达，而他们要达到一个目标：</p><img class="xing-img" style="width: 100%" src="https://www.uooyoo.com/img2017/2/15/2017021560909533.jpg" _height="0.61983" _uploaded="true"></img><p class="xing-p">创作出来的这个纹身，有没有在瞬间抓住人眼球，让人不断的想一直看。</p>'
    })
  },

  finish: function (e) {
    console.log(e.detail.content);
  },
})
