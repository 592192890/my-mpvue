<template>
  <div class="container">
    <div class="login-body">
        <div class="login-content">
            <img src="../../../static/images/phone.png"></img>
            <input type="text" placeholder="请输入手机号" v-model="phone" @input="phoneChange"/>
        </div>
        <div class="login-content">
            <img src="../../../static/images/code.png"></img>
            <input @input="codeChange" class="password" placeholder="请输入验证码" v-model="code"/>
            <span :class="{'code':true,'active':!errorPhone,'hide':isClickCode}" @click="getCode">获取验证码</span>

            <div :class="{'count-down':true, 'active':isClickCode}">{{countDownTime}}s</div>
        </div>
    </div>
    <div class="protocol">
        <span :class="{'new-radio':true,'iconfont':true, 'checked':isAgree}" @click="registerProtocol"></span>
        <span>登录即代表阅读并同意</span><span class="book" @click="goRegisterProtocol">《步步高微信平台服务协议》</span>
    </div>
    <div class="login-submit">
        <div @click="login" :class="{'login-button':true,'active':!(errorCode||!isAgree)}">登录</div>
        <button class="weixinbutton" open-type="getPhoneNumber" @click="getPhoneNumber">微信手机号授权登录</button> 

    </div>
    <div class="tips">登录后将自动绑定微信号</div>
  </div>
</template>

<script>
import { wxRequest } from '../../utils/index.js';
import store from '../../store/index.js'
export default {
  data () {
    return {
      errorCode:true,
      errorPhone:true,
      phone:'',
      code:'',
      storeUserInfo:{},
      countDownTime:60,
      isClickCode:false,
      isAgree:true //agree protocol by default
    }
  },

  methods: {
    login:function(){ 
      wx.redirectTo({
        url:'/pages/shop/main'
      })
    },
    phoneChange:function(e){
      var reg=/^[1][0-9]{10,10}$/;
      if(reg.test(this.phone)){
        this.errorPhone=false;
      }else{
        this.errorPhone=true;
      }
    },
    codeChange:function(e){
      var regPhone=/^[1][0-9]{10,10}$/;
      var reg=/^[0-9]{5,5}$/;
      if(reg.test(this.code)&&regPhone.test(this.phone)){
        this.errorCode=false
      }else{
        this.errorCode=true
      }
    },
    getCode:function(){
      if(this.errorPhone){
        return;
      }else{
        var tokenId=wx.getStorageSync('tokenId');

        // var baseAuth="Basic "+Base64.encode('1111:'+tokenId);
        //request
        var obj={
          url:store.state.apiUrl.smsLoginUrl,
          data:{
            mobile:this.phone
          },
          success:function(result){
            var countDownTime=result.data.data.smsSurplusSecond;
    
            var time=setInterval(function(){
              if(countDownTime==0){
                clearInterval(time);
                this.setData({
                  isClickCode:false,
                })
                return;
              }
              countDownTime--; 
              this.setData({
                isClickCode:true,
                countDownTime:countDownTime
              })
            }.bind(this),1000)
          }.bind(this),
          fail:function(err){
            
          }
        }
        wxRequest(obj);

      }
    },
    registerProtocol:function(){
      this.isAgree=!this.isAgree;
    },
    goRegisterProtocol:function(){
      wx.navigateTo({
        url:'/pages/protocol/main'
      })
    },
    getPhoneNumber: function (res) {
      console.log(res.detail.errMsg)
      console.log(res.detail.iv)
      console.log(res.detail.encryptedData)

      if (res.detail.errMsg == "getPhoneNumber:ok") {
        var iv = res.detail.iv;
        var encryptedData = res.detail.encryptedData

        var deviceInfo = wx.getSystemInfoSync();
        var storeUserInfo = wx.getStorageSync('storeUserInfo');
        var code = storeUserInfo['code'];

        var obj = {
          url: store.state.apiUrl.wxMobilLoginUrl,
          data: {
            code: code,
            encryptedData: encryptedData,
            iv: iv,
            deviceInfo: JSON.stringify(deviceInfo)
          },
          success: function (result) {
            var member = result.member;
            var tokenId = result.sessionId;
            var mobile = result.mobile;
            wx.setStorageSync('tokenId', tokenId);
            // if user has login,store user information
            if (member != '') {
              wx.setStorageSync('member', member);
              wx.setStorageSync('openId', result.openid);
              console.log('openId:' + result.openid)

              if (this.data.isType) {
                wx.navigateBack({
                })
              } else {
                wx.reLaunch({
                  url: '/pages/guide-shop/guide-shop'
                })
              }
            } else {
              wx.hideLoading();
            }

          },
          fail: function (result) {
            wx.hideLoading();
          }
        }
        wxRequest(obj);
      }
      
    },
  },

  created () {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo()
  }
}
</script>

<style scoped>
/* pages/login/login.wxss */
page{
    background-color:#f6f6f6;
}
.container{
  width:750px;
}
.login-body{
  width:100%;
    margin-top:20px;
    background-color:#ffffff;
}
.login-content{
    position:relative;
    height:90px;
    line-height:90px;
    font-size:28px;
}
.login-content:first-child{
    border-bottom:1px solid #efefef;
}
.login-content image{
    width:38px;
    height:38px;
    float:left;
    margin:26px 32px 0 32px;
}
.login-content input{
    height:90px;
    line-height:90px;
}
.login-content .code{
    color:#cccccc;
    position:absolute;
    top:0px;
    right:0px;
    margin-right:20px;
}
.login-content .code.active{
    color:#f95d5b;
}
.login-content .code.hide{
    display: none;
}
.login-content .count-down{
    display: none;
    position:absolute;
    top:0px;
    right:0px;
    margin-right:20px;
    color:#f95d5b;
    
}
.login-content .count-down.active{
    display: block;
}
.password{
    width:400px;
}

.login-submit{
    width:100%;
    
    font-size:32px;
    /*margin-top:30px;*/
}
.login-submit .login-button{
    margin:30px 30px 0 30px;
    background-color:#d2d2d2;
    color:#ffffff;
    height:88px;
    line-height:88px;
    text-align:center;
    font-size:32px;
    border-radius:8px;
}

.login-submit .login-button.active{
    margin:30px 30px 0 30px;
    background-color:#fede5b;
    color:#000000;
}

.protocol{
    margin-top:34px;
    margin-bottom:60px;
    font-size:26px;
    color:#666666;
}
.protocol .new-radio:after{
    content:'\e616';
    font-size:38px;
    color:#cccccc;
}
.protocol .book{
    color:#5ba2f9;
}
.protocol .new-radio{
    margin-right:20px;
}
.protocol .new-radio.checked{
    display: inline-block;

}
.protocol .new-radio.checked:after{
    content:'\e617';
    font-size:38px;
    color:#666666;
}
.tips{
    position:fixed;
    bottom:20px;
    width:100%;
    color:#999999;
    font-size:26px;
    text-align:center;
}

.weixinbutton {
  border-radius:8px;
  font-size:32px;
  /* width:80%; */
  height:88px;
  color:#ffda44;
  margin-top:30px;
  background-color:white;
  margin:30px 30px 0 30px;
}

.weixinbutton::after {
  border:2px solid #ffda44;
}
</style>
