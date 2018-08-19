import store from '../store/index.js'
function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}
export function wxRequest(obj){
  wx.request({
    url:obj.url,
    method:obj.method||'POST',
    header:{
      'content-type': 'application/x-www-form-urlencoded',
      'tokenId':wx.getStorageSync('tokenId')
    },
    data:obj.data,
    success:function(result){
      // console.log(result)
      if(result.statusCode==200){
          if(result.data.error==0){
            obj.success(result);
          }else{
            //if don't login; go to login page;
            // if(result.data.error==-100){
            //   wx.reLaunch({
            //     url: '/pages/login/main'
            //   })
            //   return;
            // }
            if(wx.hideLoading){
              wx.hideLoading();
            }
            wx.showModal({
              title:'提示',
              showCancel:false,
              content:result.data.msg,
              confirmColor:'#f95d5b',
              success:function(){
                if(obj.isSumObj){
                  obj.isSumObj.isSum=false;
                }
                var currentPage=getCurrentPages()[getCurrentPages().length -1].route||getCurrentPages()[getCurrentPages().length -1].__route__;
                if(currentPage=="/pages/login/main"){
                  setTimeout(function(){
                      wx.redirectTo({
                        url:'/pages/unlogin/unlogin'
                      })
                  }.bind(this),1000)
                }
                obj.fail(result)
              }.bind(this)
            });

          }
      }else{
        wx.showModal({
          title:'错误',
          showCancel:false,
          content:'服务器错误！',
          confirmColor:'#f95d5b',
          success:function(){
            if(obj.isSumObj){
              obj.isSumObj.isSum=false;
            }
            var currentPage=getCurrentPages()[getCurrentPages().length -1].route||getCurrentPages()[getCurrentPages().length -1].__route__;
            if(currentPage=="/pages/login/main"){
              setTimeout(function(){
                  wx.redirectTo({
                    url:'/pages/unlogin/unlogin'
                  })
              }.bind(this),1000)
            }
          }.bind(this)
        })
      }
      if(obj.url!=store.state.apiUrl.getShopLBSUrl&&obj.url!=store.state.apiUrl.balanceOrderUrl&&obj.url!=store.state.apiUrl.receiveOrderUrl){
        if(wx.hideLoading){
          wx.hideLoading();
        }
      }
      // if(wx.hideLoading){
      //   wx.hideLoading();
      // }

      if(obj.loginStatus){
        obj.loginStatus.status=true;
      }
    },
    fail:function(err){
      if(wx.hideLoading){
        wx.hideLoading();
      }
      obj.fail&&obj.fail(err);
      if(obj.loginStatus){
        obj.loginStatus.status=true;
      };
      if(obj.locationStatus){
        obj.locationStatus.status=true;
      };
      wx.showModal({
        title:'错误',
        content:'网络异常，请稍后再试!',
        showCancel:false,
        confirmColor:'#f95d5b',
        success:function(){
          var currentPage=getCurrentPages()[getCurrentPages().length -1].route||getCurrentPages()[getCurrentPages().length -1].__route__;
          if(currentPage=="/pages/login/main"){
             setTimeout(function(){
                wx.redirectTo({
                  url:'/pages/unlogin/unlogin'
                })
              }.bind(this),1000)
          }
        }
      })
    }
  })
}

export function calculatePriceBySelectedOrder(selectedOrderList){
  //calculate all selected products' price
    var sumPrice=0;
    selectedOrderList.forEach(function(value,index){
      if(value.isCheck){
        sumPrice=sumPrice+parseFloat(value.sum)
      }
    });
    return sumPrice;
}
export function getPackageArr(){
  // small package's id:1; middle:2; big:3
  var packageObj=store.state.packages;
  var smallPackage=Object.assign({},packageObj.small,{
    id:1,
    isCheck:true,
    quantity:1,
    isTouchMove:false
  });
  var middlePackage=Object.assign({},packageObj.mid,{
    id:2,
    quantity:1,
    isCheck:true,
    isTouchMove:false,
  });
  var bigPackage=Object.assign({},packageObj.max,{
    id:3,
    quantity:1,
    isCheck:true,
    isTouchMove:false
  });

  var packageArr=[smallPackage,middlePackage,bigPackage];
  return packageArr;
};
export default {
  formatNumber,
  formatTime,
  wxRequest
}
