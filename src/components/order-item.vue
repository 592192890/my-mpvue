<template>
  <div class="order-body">
    <div class="header">
        <img src="../../static/images/shop.png">
        <div class="left">{{currentOrder.shopName}}</div>
        <div class="right">{{currentOrder.createTime}}</div>
    </div>
    <div class="item" @tap="goOrderDetail" :data-id="currentOrder.orderId">
        <div class="product-des">
            <div class="product-name">
                <text class="mark" v-if="currentOrder.orderType==1">鲜</text>
                <text>{{currentOrder.name}}</text>
            </div>
            <div class="number">共{{currentOrder.productNum}}件商品</div>
            <div class="total-price">
                <text class="left">总计：</text>
                <text class="right">¥{{currentOrder.payAmount}}</text>
            </div>
        </div>
    </div>
    <div class="action">
        <div class="status">交易完成</div>
        <div class="cancel btn"  @tap="cancelOrder" :data-id="orderId" :data-selected="selected">取消订单</div>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import MpvueRouterPatch from 'mpvue-router-patch'

Vue.use(MpvueRouterPatch)
export default {
    props:[
        'orderItem',
        'selected'
    ],
    data(){
        return {
            currentOrder:this.orderItem
        }
    },
    methods:{
      goOrderDetail(){

      },
      cancelOrder(){

      }
    }
}
</script>

<style scoped>
.tab-group{
    border-top: 1px solid #efefef;
    height: 100rpx;
    position:fixed;
    bottom:0px;
    left:0px;
    right:0px;
    display: flex
}
.tab-item{
    flex:1
}
.tab-img{
    display:block;
    width: 60rpx;
    height: 60rpx;

    margin: 7rpx auto 0 auto;
}
.text{
    font-size:26rpx;
    text-align:center;
}
</style>
