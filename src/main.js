import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      '^pages/login/main',
      'pages/protocol/main',
      'pages/shop/main',
      'pages/scan/main',
      'pages/my/main',
      'pages/order/main',
      'pages/cart/main'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
//     tabBar: {
//       position: "bottom",
//       color: "#353535",
//       selectedColor: "#000000",
//       borderStyle: "black",
//       backgroundColor: "#ffffff",
//       list: [
//           {
//               "pagePath": "pages/cart/main",
//               "text": "购物车",
//               "iconPath": "/static/images/cart.png",
//               "selectedIconPath": "/static/images/cart-active.png"
//           },
//           {
//               "pagePath": "pages/scan/main",
//               "text": "扫一扫",
//               "iconPath": "/static/images/scan.png",
//               "selectedIconPath": "/static/images/scan-active.png"
//           },
//           {
//               "pagePath": "pages/my/main",
//               "text": "我的",
//               "iconPath": "/static/images/my.png",
//               "selectedIconPath": "/static/images/my-active.png"
//           }
//       ]
//   },
  }
}
