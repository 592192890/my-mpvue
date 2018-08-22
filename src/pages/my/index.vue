<template>
    <div>
        <div class="header">
            <div class="info">
                <div class="item img">
                    <img :src="userInfo.avatarUrl" v:if="userInfo.avatarUrl">
                </div>
                <div class="item">{{userInfo.nickName}}/{{mobile}}</div>
                <div class="item last">
                    <div class="img vip">
                        <img src="../../../static/images/silver.png" v:if="memberLevel=='银卡'">
                        <img src="../../../static/images/gold.png" v:if="memberLevel=='金卡'">
                        <img src="../../../static/images/diamond.png" v:if="memberLevel=='钻石卡'">
                        <span class="member-name">{{memberLevel}}</span>
                    </div>
                </div>
            </div>
            <div class="tab-group">
                <div class="tab-item" data-id="1" @tap="goOrder">
                    <img class="img-item all-order" src="../../../static/images/all-order.png">
                  
                    <div class="order-item all-order">
                        全部订单
                    </div>
                </div>
                <div class="tab-item" data-id="2" @tap="goOrder">
                    <img src="../../../static/images/unpay.png" class="img-item unpay">
         
                    <div class="top-number" :class="{'active':unpayNumber>0}">{{unpayNumber}}</div>
                    <div class="order-item unpay">
                        待付款
                    </div>
                </div>
                <div class="tab-item" data-id="3" @tap="goOrder">
                    <img src="../../../static/images/uncheck.png" class="img-item uncheck">
                    <div class="top-number" :class="{'active': unpayNumber>0}">{{uncheckNumber}}</div>
                    <div class="order-item uncheck">
                        待核检
                    </div>
                </div>

            </div>
        </div>

        <div class="list-item first" @tap="goIdentifyCode">
        <div class="inner">
            <div class="label">身份核检码</div>
            <div class="code-img">
                <img src="../../../static/images/my-code.png">
            </div>
            <div class="img iconfont"></div>
        </div>
        </div>

        <div class="list-item first" bindtap="goInvoice">
            <div class="inner" style="border-top:1rpx solid #efefef">
            <div class="label">开发票</div>
            <div class="img iconfont"></div>
            </div>
        </div>

        <div class="list-item" @tap="goDiscountCouponList">
            <div class="inner" style="border-bottom:1rpx solid #efefef">
                <div class="label">优惠券</div>
                <div class="img iconfont"></div>
            </div>
        </div>

        <div class="list-item" @tap="goToggleShop">
            <div class="inner" style="border-bottom:1rpx solid #efefef">
                <div class="label">切换门店</div>
                <div class="img iconfont"></div>
            </div>
        </div>

        <div class="list-item" @tap="goHelpCenter">
            <div class="inner" style="border-top:1rpx solid #efefef">
                <div class="label">帮助中心</div>
                <div class="img iconfont"></div>
            </div>
        </div>
        <tab-group type="3"></tab-group>
    </div>
</template>
<script>
import store from '../../store/index.js'
import tabGroup from '../../components/tab-group.vue'
import { wxRequest } from '../../utils/index.js';
var startWith = store.state.START_WITH
export default {
    components:{
        tabGroup
    },
    data(){
        return {
            userInfo:{},
            uncheckNumber:0,
            unpayNumber:0,
            memberLevel:'',
            mobile:'',
            isDefaultUserLevel:true,
            defaultLevel:1
        }
    },
    methods:{
        goOrder(e){
            // type:1-->all order; 2--->unpay order;3--->uncheck  order
            var type=e.currentTarget.dataset.id;
            this.$router.push({path:'/pages/order/main',query:{type:type}})
        },
        goIdentifyCode(e){
            this.$router.push({path:'/pages/identify-code/main'})
         
        }, 
        goDiscountCouponList () {
            this.$router.push({path:'/pages/discountCouponList/main'})
            
        },
        goToggleShop(){
            this.$router.push({path:"/pages/shop/main",query:{type:'toggle'}})
        },

        goInvoice() {
       
            var url = 'https://wx.yunhou.com/super/member/tickets';
            var encodeUrl = encodeURIComponent(url)
            wx.navigateTo({
                url: '../web/web?url=' + encodeUrl,
            })
        },

        goHelpCenter(){
            wx.navigateTo({
            url:'/pages/help/help'
            })
        },
    },
    created:function(){
      //get user information from cache
      this.userInfo=wx.getStorageSync('storeUserInfo');
      this.memberLevel=wx.getStorageSync('member').tier;
      this.mobile='13554150381';

      //judge whether is default user level
      var defaultLevel=wx.getStorageSync('configData').card_level_default||startWith;
      var isDefaultUserLevel=true;
      if(defaultLevel.indexOf(this.memberLevel)!=-1||!this.memberLevel){
        this.isDefaultUserLevel=true
      }else{
        this.isDefaultUserLevel=false;
      }
 
      
    },
    mounted:function(){
        var obj={
        url:store.state.apiUrl.isUnoperatedOrderUrl,
        data:{
            
        },
        success:function(result){
            this.uncheckNumber=result.data.data.uncheckOrder.number;

            this.unpayNumber=result.data.data.unpaidOrder.number;
            
            
            
        }.bind(this),
        fail:function(err){
        }
        };
        wxRequest(obj);
    }
}
</script>
<style scoped>
/* pages/my/my.wxss */
page{
    background-color:#f6f6f6;
}
.header{
    width:100%;
    background-color:#ffffff;
}
.header .info .item{
    text-align: center;
    font-size:32rpx;
}
.header .info .item .member-name{
    display:inline-block;
    margin-left:10rpx;
    font-size:26rpx;
    height:40rpx;
    line-height:40rpx;
}
.header .info .item.last{
    margin:20rpx auto 50rpx auto;
    font-size:26rpx;
    height:40rpx;
    text-align:center;
}
.header .info .item .img{
    height:40rpx;
    line-height:40rpx;
    width:190rpx;
    text-align:center;
    border:1rpx solid #e5e5e5;
    border-radius:26rpx;
    margin:0 auto;

}
.header .info .item .img.minify{
   width:160rpx; 
}
.header .info .item image{
    padding-top:50rpx;
    height:150rpx;
    width:150rpx;
}
.header .info .item.img image{
    padding-top:0px;
    margin-top:50rpx;
    margin-bottom:30rpx;
    border-radius:50%;
}
.header .info .item .vip{
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
}
.header .info .item .vip image{
    padding-top:0px;
    height:24rpx;
    width:32rpx;
    vertical-align:middle;
    margin-bottom:8rpx;
}
.header .info .item.last .img{
    position:relative;
}
.list-item{
    width:100%;
    height:90rpx;
    background-color:#ffffff;
}
.list-item.first{
    margin:20rpx 0 20rpx 0;
}

.list-item .inner{
    margin:0 0 0 30rpx;
    padding-right:30rpx;
    position:relative;
    color:#333333;
}
.list-item .inner .code-img{
    width:40rpx;
    height:34rpx;
    /*vertical-align:middle;
    display: inline-block;*/
    position:absolute;
    right:80rpx;
    top:28rpx;
}
.list-item .inner .code-img image{
    width:100%;
    height:100%;
}
.list-item .label{
    display: inline-block;
    font-size:30rpx;
    line-height:90rpx;
}
.list-item .img{
    line-height:90rpx;
    float:right;
    height:90rpx;

}
/*.list-item .img image{
    width:40rpx;
    height:34rpx;
    margin-top:28rpx;
}*/

.list-item .img:after{
    content:'\e623';
    /*margin-left:20rpx;*/
    color:#cccccc;
    font-size:30rpx;
    /*vertical-align:middle;*/
}
.img-group .img-item{
    display:inline-block;
}
.tab-group{
    display:flex;
    display: -webkit-flex;
    text-align:center;
    border-top:1rpx solid #efefef;

}
.tab-item{
    flex:1;
    padding:34rpx 0 30rpx 0;
    position:relative;
    justify-content:center;

}
.tab-item .img-item{
    width:50rpx;
    height:50rpx;
}
.tab-item .top-number{
    display: none;
    position: absolute;
    top:18rpx;
    right:76rpx;
    background-color:#f95d5b;
    color:#ffffff;
    width:38rpx;
    height:38rpx;
    border-radius:50%;
    font-size:26rpx;
    line-height:38rpx;
    text-align:center;
}
.tab-item .top-number.active{
    display: inline-block
}
.tab-item .order-item{
    font-size:28rpx;
    color:#666666;
    padding-top:10rpx;
    text-align:center;
}


</style>