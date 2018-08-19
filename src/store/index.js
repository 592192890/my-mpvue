// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    apiUrl: {
        wxLoginUrl: 'https://ssl.yunhou.com/easygo/users/wx_user_login',
        //获取用户微信中绑定手机号登录
        wxMobilLoginUrl: 'https://ssl.yunhou.com/easygo/users/wx_auth_phone_login',
        getCaptchaUrl: 'https://ssl.yunhou.com/easygo/users/send_sms_captcha',
        smsLoginUrl: 'https://ssl.yunhou.com/easygo/users/sms_login',
        getProductInfoUrl: 'https://ssl.yunhou.com/easygo/products/get',
        balanceOrderUrl: 'https://ssl.yunhou.com/easygo/orders/confirm_order',
        submitOrderUrl: 'https://ssl.yunhou.com/easygo/orders/add',
        getOrderListUrl: 'https://ssl.yunhou.com/easygo/orders/lists',
        getOrderDetailUrl: 'https://ssl.yunhou.com/easygo/orders',
        cancelOrderUrl: 'https://ssl.yunhou.com/easygo/orders/cancel',
        payOrderUrl: 'https://ssl.yunhou.com/easygo/orders/pay',
        // 扫描成功
        isUnoperatedOrderUrl: 'https://ssl.yunhou.com/easygo/users/unorders',
        // 个人中心优惠券列表
        myDiscountCouponListUrl: 'https://ssl.yunhou.com/beacons/coupon/my', //https://ssl.yunhou.com/easygo/coupons/my
  
        deleteOrderUrl: 'https://ssl.yunhou.com/easygo/orders/delete',
  
        queryPayResultUrl: 'https://ssl.yunhou.com/easygo/orders/payed',
  
        getConfigUrl: 'https://ssl.yunhou.com/easygo/sys/config',
  
        getShopListUrl: 'https://ssl.yunhou.com/easygo/sys/shoplist',
  
        getShopLBSUrl: 'https://ssl.yunhou.com/easygo/sys/lbstoshop',
  
        receiveOrderUrl: 'https://ssl.yunhou.com/easygo/orders/receipt',
  
        check_coupon: "https://ssl.yunhou.com/easygo/orders/check_coupon"//核验优惠券
    },
    appGlobalData: {
    },
    maxSku:4,
    packages:{
      small:{
        name:'小购物袋',
        productName:'小购物袋',
        barcode:'11111',
        price:0.1
      },
      mid:{
        name:'中购物袋',
        productName:'中购物袋',
        barcode:'22222',
        price:0.2
      },
      max:{
        name:'大购物袋',
        productName:'大购物袋',
        barcode:'3333',
        price:0.3
      }
    },
    scanShopId:'',
    gotoPage: '', //页面路由
    gotoPageParam: '', //页面路由参数
    PAGE_SIZE: 10, //every page contain data count
    START_WITH: ['48', '49'], //鲜食演义开头的数字
    cityList:[
      {
        "word":"C",
          "cityList":[
            {
              "cityName":"长沙主城",
              "shopNameArr":[
                {
                  "shopId":"120122",
                  "shopName":"长沙南国"
                },
                {
                  "shopId":"120056",
                  "shopName":"红星店"
                },
                {
                  "shopId":"120236",
                  "shopName":"梅溪湖点"
                }
              ]
            },
            {
              "cityName":"成都",
              "shopNameArr":[
                {
                  "shopId":"120372",
                  "shopName":"成都成飞店"
                },
                {
                  "shopId":"120211",
                  "shopName":"成都川师店"
                },
                {
                  "shopId":"120213",
                  "shopName":"郫县红光店"
                },
                {
                  "shopId":"120269",
                  "shopName":"成都青羊万达店"
                }
              ]
            },{
              "cityName":"常德",
              "shopNameArr":[
                {
                  "shopId":"120151",
                  "shopName":"常德桥南店"
                },
                {
                  "shopId":"120329",
                  "shopName":"安乡城市广场店"
                },
                {
                  "shopId":"120255",
                  "shopName":"常德万达店"
                }
              ]
            },
            {
              "cityName":"郴州",
              "shopNameArr":[
                {
                  "shopId":"120022",
                  "shopName":"郴州店"
                }
              ]
            }
          ]
        },
        {"word":"D","cityList":[{"cityName":"\u5fb7\u9633","shopNameArr":[{"shopId":"120371","shopName":"\u56db\u5ddd\u5fb7\u9633\u5e97"}]}]},{"word":"G","cityList":[{"cityName":"\u6842\u6797","shopNameArr":[{"shopId":"120404","shopName":"\u6842\u6797\u56fd\u5c55\u5e7f\u573a\u5e97"}]}]},{"word":"H","cityList":[{"cityName":"\u6cb3\u6c60","shopNameArr":[{"shopId":"120408","shopName":"\u6cb3\u6c60\u4e2d\u5fc3\u5e7f\u573a\u5e97"}]},{"cityName":"\u8861\u9633","shopNameArr":[{"shopId":"120318","shopName":"\u8861\u9633\u4e07\u8fbe\u5e97"},{"shopId":"120185","shopName":"\u8861\u9633\u89e3\u653e\u8def\u5e97"},{"shopId":"120053","shopName":"\u8861\u9633\u5e97"}]},{"cityName":"\u6000\u5316","shopNameArr":[{"shopId":"120075","shopName":"\u6000\u5316\u5e9c\u5b89\u5e97"}]}]},{"word":"J","cityList":[{"cityName":"\u4e5d\u6c5f","shopNameArr":[{"shopId":"120308","shopName":"\u4e5d\u6c5f\u4e07\u8fbe\u5e97"}]},{"cityName":"\u5409\u9996","shopNameArr":[{"shopId":"120179","shopName":"\u5409\u9996\u5e97"}]}]},{"word":"L","cityList":[{"cityName":"\u67f3\u5dde","shopNameArr":[{"shopId":"120425","shopName":"\u67f3\u5dde\u9633\u5149100\u5e97"},{"shopId":"120416","shopName":"\u67f3\u5dde\u67f3\u77f3\u5e97"},{"shopId":"120419","shopName":"\u67f3\u5dde\u9f99\u5c6f\u5e97"},{"shopId":"120406","shopName":"\u67f3\u5dde\u8c37\u57e0\u5e7f\u573a\u5e97"},{"shopId":"120195","shopName":"\u67f3\u5dde\u5e7f\u573a\u8def\u5e97"}]},{"cityName":"\u6cf8\u5dde","shopNameArr":[{"shopId":"120316","shopName":"\u56db\u5ddd\u6cf8\u5dde\u65b0\u5929\u5730\u5e97"},{"shopId":"120338","shopName":"\u6cf8\u5dde\u6c5f\u9633\u5e97"}]},{"cityName":"\u5a04\u5e95","shopNameArr":[{"shopId":"120051","shopName":"\u5a04\u5e95"},{"shopId":"120312","shopName":"\u5a04\u5e95\u4e94\u6c5f\u78a7\u6842\u56ed\u5e97"}]}]},{"word":"N","cityList":[{"cityName":"\u5357\u5b81\u5357","shopNameArr":[{"shopId":"120411","shopName":"\u5357\u5b81\u65b0\u9633\u5e97"},{"shopId":"120409","shopName":"\u5357\u5b81\u826f\u5e86\u5e97"},{"shopId":"120433","shopName":"\u5357\u5b81\u4ead\u6c5f\u8d2d\u7269\u4e2d\u5fc3\u5e97"}]},{"cityName":"\u5357\u5b81\u5317","shopNameArr":[{"shopId":"120401","shopName":"\u5357\u5b81\u5357\u68c9\u5e7f\u573a\u5e97"}]}]},{"word":"P","cityList":[{"cityName":"\u840d\u4e61","shopNameArr":[{"shopId":"120262","shopName":"\u840d\u4e61\u91d1\u6e90\u5e97"},{"shopId":"120254","shopName":"\u840d\u4e61\u6da6\u8fbe\u56fd\u9645\u5e97"}]}]},{"word":"S","cityList":[{"cityName":"\u4e0a\u9976","shopNameArr":[{"shopId":"120259","shopName":"\u4e0a\u9976\u4e07\u8fbe\u5e97"}]},{"cityName":"\u90b5\u9633","shopNameArr":[{"shopId":"120045","shopName":"\u7ea2\u65d7\u8def\u5e97"},{"shopId":"120206","shopName":"\u90b5\u9633\u4eba\u6c11\u5e7f\u573a\u5e97"},{"shopId":"120149","shopName":"\u90b5\u9633\u5357\u7ad9\u8d85\u5e02"},{"shopId":"120020","shopName":"\u90b5\u9633\u8d2d\u7269\u5e7f\u573a\u8d85\u5e02"}]}]},{"word":"X","cityList":[{"cityName":"\u65b0\u4f59","shopNameArr":[{"shopId":"120349","shopName":"\u65b0\u4f59\u9ad8\u65b0\u8303\u57ce\u5e97"},{"shopId":"120152","shopName":"\u65b0\u4f59\u4eba\u548c"},{"shopId":"120127","shopName":"\u65b0\u4f59\u5730\u738b\u8d85\u5e02"}]},{"cityName":"\u6e58\u6f6d\u6cb3\u897f","shopNameArr":[{"shopId":"120010","shopName":"\u6c5f\u5357\u5e97"},{"shopId":"120014","shopName":"\u5e7f\u4e91\u5e97"},{"shopId":"120309","shopName":"\u57fa\u5efa\u8425\u7cae\u8d38\u5e97"},{"shopId":"120033","shopName":"\u91d1\u6d77\u5e97"}]},{"cityName":"\u6e58\u6f6d\u6cb3\u4e1c","shopNameArr":[{"shopId":"120153","shopName":"\u677f\u5858\u591a\u4f26\u5e97"},{"shopId":"120201","shopName":"\u6e58\u6f6d\u4e1c\u65b9\u7ea2\u5e97"},{"shopId":"120145","shopName":"\u8d2d\u7269\u5e7f\u573a\u5e97"}]}]},{"word":"Y","cityList":[{"cityName":"\u5b9c\u6625","shopNameArr":[{"shopId":"120258","shopName":"\u5b9c\u6625\u4e07\u8fbe\u5e97"},{"shopId":"120043","shopName":"\u5b9c\u6625\u5e97\u8d85\u5e02"},{"shopId":"120180","shopName":"\u5b9c\u6625\u4e2d\u5c71\u8def\u5e97"}]},{"cityName":"\u5cb3\u9633","shopNameArr":[{"shopId":"120170","shopName":"\u5cb3\u9633\u91d1\u9e57\u5e97"},{"shopId":"120327","shopName":"\u5cb3\u9633\u65b0\u5929\u5730\u5e97"}]},{"cityName":"\u6c38\u5dde","shopNameArr":[{"shopId":"120129","shopName":"\u6c38\u5dde\u821c\u5fb7\u6469\u5c14\u8d85\u5e02"},{"shopId":"120095","shopName":"\u5f90\u5bb6\u4e95\u5e97"},{"shopId":"120034","shopName":"\u51e4\u51f0\u56ed\u5e97"}]},{"cityName":"\u76ca\u9633","shopNameArr":[{"shopId":"120268","shopName":"\u76ca\u9633\u4e07\u8fbe\u5e97"},{"shopId":"120015","shopName":"\u5eb7\u5bcc\u5e97"}]}]},{"word":"Z","cityList":[{"cityName":"\u8d44\u9633","shopNameArr":[{"shopId":"120285","shopName":"\u6b65\u6b65\u9ad8\u8d44\u9633\u5e97"}]},{"cityName":"\u81ea\u8d21","shopNameArr":[{"shopId":"120292","shopName":"\u6b65\u6b65\u9ad8\u7d2b\u6a80\u5e97"}]},{"cityName":"\u682a\u6d32","shopNameArr":[{"shopId":"120082","shopName":"\u4e1c\u90fd\u5e97"},{"shopId":"120017","shopName":"\u6e58\u5929\u6865"},{"shopId":"120030","shopName":"\u56fd\u5b89\u8d2d\u7269\u5e7f\u573a\u8d85\u5e02"}]},{"cityName":"\u5f20\u5bb6\u754c","shopNameArr":[{"shopId":"120173","shopName":"\u5f20\u5bb6\u754c\u5341\u5b57\u8857\u5e97"}]}]}]
  },
  mutations: {
    
  }
})

export default store
