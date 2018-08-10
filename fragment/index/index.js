const app = getApp()

Page({
  data: {
    html: '<p class="xing-p">123124<br><br>123124123<br><br><br>324123</p><img class="xing-img" style="width: 100%" src="http://localhost:3000/static/73e95bd90f005.png" _height="0.5743348982785602" _uploaded="true"></img><p class="xing-p">333</p><img class="xing-img" style="width: 100%" src="http://localhost:3000/static/2dab4bd82f879.png" _height="1.2095588235294117" _uploaded="true"></img>',
  },

  finish: function (e) {
    console.log(e.detail.content);
  },
})
