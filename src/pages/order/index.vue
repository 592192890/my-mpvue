<template>
    <div>
        <div class="tab-group">
            <div class="tab-item" :class="{'active':selected=='1'}" @tap="toggleOrder(1)">全部订单</div>
            <div class="tab-item" :class="{'active':selected=='2'}" @tap="toggleOrder(2)">待付款</div>
            <div class="tab-item" :class="{'active':selected=='3'}" @tap="toggleOrder(3)">待核检</div>
        </div>
        <div class="tab-content">
            <div class="noData" :class="{'show':noData}">
            <div v-if="selected=='1'">
                <span>您没有任何订单</span>
            </div>
            <div v-else-if="selected=='2'">
                <span>您没有待付款订单</span>
            </div>
            <div c-else>
                <span>您没有待核检订单</span>
            </div>
            </div>
            <swiper :current="currentTab" duration="500" @change="swiperChange">
            <swiper-item v-if="selected==1">
                <div class="content-item">
                <scroll-div class="scroll-div" :scroll-top="toTop" scroll-y="true" scroll-with-animation="true" bindscrolltolower="loadMore" data-id='1'>
                  
                    <order-item v-for="item in allOrderList" :key="item.orderId" :orderItem="item" :selected="selected"></order-item>
                  
                    <div class="loading" :class="{'show':loading}">加载中...</div>
                    <div class="noMoreData" :class="{'show':noMoreData}">
                    <span class="line"></span>
                    <span class="label">没有更多数据了</span>
                    <span class="line"></span>
                    </div>
                </scroll-div>
                </div>
            </swiper-item>
            <swiper-item v-if="selected==2">
                <div class="content-item">
                <scroll-div class="scroll-div" :scroll-top="toTop" scroll-y="true" scroll-with-animation="true" @scrolltolower="loadMore" data-id='2'>
             
                    <order-item v-for="item in unpayOrderList" :key="item.orderId" :orderItem="item" :selected="selected"></order-item>
                
                    <div class="loading" :class="{'show':loading}">加载中...</div>
                    <div class="noMoreData" :class="{'show':noMoreData}">
                    <span class="line"></span>
                    <span class="label">没有更多数据了</span>
                    <span class="line"></span>
                    </div>
                </scroll-div>
                </div>
            </swiper-item>
            <swiper-item v-if="selected==3">
                <div class="content-item">
                <scroll-div class="scroll-div" :scroll-top="toTop" scroll-y="true" scroll-with-animation="true" @scrolltolower="loadMore" data-id='3'>
   
                    <order-item  v-for="item in uncheckOrderList" :key="item.orderId" :orderItem="item" :selected="selected"></order-item>
                 
                    <div class="loading" :class="{'show':loading}">加载中...</div>
                    <div class="noMoreData" :class="{'show':noMoreData}">
                    <span class="line"></span>
                    <span class="label">没有更多数据了</span>
                    <span class="line"></span>
                    </div>
                </scroll-div>
                </div>
            </swiper-item>

            </swiper>

        </div>
    </div>
</template>
<script>
var PAGE_INDEX = 1; //current page index
var TOTAL_PAGE = 0;  //all order list's count
var tabId = ['1', '2', '3'];
var tabStatus = [null, 'paid', 'check'];
var currentOrderId;
var currentOrderType;
var showModalFlag = true;
import store from '../../store/index.js'
import { wxRequest } from '../../utils/index.js';
import OrderItem from '../../components/order-item';
export default {
    components:{
        OrderItem
    },
    data(){
        return {
            selected: '1',
            allOrderList: store.state.orderList,
            unpayOrderList: [],
            uncheckOrderList: [],
            currentTab: 0,  //swiper index
            noMoreData: false,// no more data
            noData: false,//no data
            loading: false,//loading
            toTop: 0      //if toggle order tab,scrollTop=0
        }
    },
    methods:{
        swiperChange(e) {
            
        },
        toggleOrder(type) {
            this.selected=type;
            if(type==1){
                this.allOrderList=store.state.orderList;
            }
            if(type==2){
                this.unpayOrderList=store.state.orderList.filter(v=>{
                    return v.id==type;
                })
                console.log(this.unpayOrderList)
            }
            if(type==3){
                this.uncheckOrderList=store.state.orderList.filter(v=>{
                    return v.id==type;
                })
            }
        },
        goOrderDetail: function (e) {
           
        },
        deleteOrder: function (e) {
            

        },

        payOrder: function (e) {
            
        },
        applyRefund: function (e) {
            

        },
        receiveOrder: function (e) {
           
        },
        cancelOrder: function (e) {
            
        },
        loadMore: function (e) {
            
        },
        //query order list by pageIndexx
        queryOrderList: function (status, selected, pageIndex) {
            
        },
    }

}    
</script>
<style>
/* pages/order/order.wxss */
page{
    background-color:#f6f6f6;
}
.tab-group{
    display: flex;
    display: -webkit-flex;
    text-align:center;
    background-color:#ffffff;
    border-top:1rpx solid #efefef;
    border-bottom:1rpx solid #f6f6f6;
    height:80rpx;
    align-items:center;
    position:fixed;
    top:0px;
    width:100%;
    z-index:100;
    font-size:30rpx;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
}
.tab-item{
    flex:1;
    margin:25rpx 50rpx 15rpx 50rpx;
    /*height:80rpx;*/
    /*line-height:80rpx;*/
    padding-bottom:10rpx;
    color:#666666;
}
.tab-item.active{
    border-bottom:2px solid #fede5b;
    color:#333333;
    margin-bottom:13rpx;
}

.tab-content{
    margin-top:80rpx;
}
.scroll-div{
    height:calc(100vh - 100rpx);
}
/*.content-item{
    display: none;
}
.content-item.active{
    display: block;
}*/

.order-body{
    background-color:#ffffff;
    margin-top:20rpx;
}
/*.order-body:first-child{
    margin-top:0px;
}*/
.order-body .header{
    margin:0 30rpx;
    /*font-size:28rpx;*/
    height:80rpx;
    color:#666666;
    position:relative;
}
.order-body .header .left{
    display: inline-block;
    line-height:80rpx;
    height:80rpx;
    color:#666666;
    font-size:28rpx;
    position: relative;
    margin-left:10rpx;
}
.order-body .header image{
    width:40rpx;
    height:40rpx;
    /*position:absolute;
    top:20rpx;
    left:0px;*/
    vertical-align: middle;
    color:#999999;
}

/*.order-body .header .left:before{
    content:'\e7c2';
    font-size:40rpx;
    margin-right:10rpx;
    position:relative;
    top:5rpx;
    color:#999999;
}*/
.order-body .header .right{
    float:right;
    line-height:80rpx;
    color:#999999;
    font-size:24rpx;
}
.order-body .action{
    height:90rpx;
    line-height:90rpx;
    padding:0 30rpx;
    position:relative;
    font-size:28rpx;
}

.order-body .action .status{
    display:inline-block;
    height:90rpx;
    line-height:90rpx;
    color:#f95d5b;
}
.order-body .action .btn{
    color:#333333;
    border-radius:4rpx;
    font-size:30rpx;
    height:60rpx;
    right:30rpx;
    line-height:60rpx;
    width:160rpx;
    text-align:center;
    display: inline-block;
    border:2rpx solid #efefef;
    box-sizing:border-box;
    position:absolute;
    top:50%;
    margin-top:-30rpx;
}
.order-body .action .btn.pay{
    background-color:#fede5b;
    border:none;
}

.order-body .item{
    /*height:170rpx;*/
    padding:0 30rpx;
    background-color:#f9fafc;
}
.order-body .item .product-des .product-name{
    font-size:30rpx;
    min-height:30rpx;
    padding-top:20rpx;
    width:700rpx;
    overflow:hidden;
    span-overflow: ellipsis;
    white-space: nowrap;
    word-break: all;
    color:#333333;
}
.order-body .item .product-des .product-name .mark{
    width:38rpx;
    height:38rpx;
    font-size:28rpx;
    color:#333333;
    border-radius:8rpx;
    text-align:center;
    line-height:38rpx;
    background-color:#f9d544;
    display:inline-block;
    margin-right:10rpx;
}
.order-body .item .product-des .number{
    font-size:26rpx;
    min-height:26rpx;
    color:#999999;
    margin-top:10rpx;
}
.order-body .item .product-des .total-price{
    font-size:28rpx;
    min-height:30rpx;
    margin-top:20rpx;
    padding-bottom:20rpx;
}
.order-body .item .product-des .total-price .left{
    font-size:26rpx;
    color:#333333;
}
.order-body .item .product-des .total-price .right{
    font-size:30rpx;
    /*font-weight:bold;*/
    color:#333333;
}

swiper{
    height:calc(100vh - 100rpx)
}
.noData,.noMoreData,.loading{
    display: none;
    text-align:center;
    height:40rpx;
    color:#999999;
    font-size:26rpx;
    
}
.noMoreData,.loading{
    padding-top:20rpx;
}
.noData.show,.noMoreData.show,.loading.show{
    display: block;
    
}
.noData.show{
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    -webkit-transform: translate(-50%,-50%);
}
.noMoreData .label{
    display: inline-block;
    margin-left:20rpx;
    margin-right:20rpx;
}
.noMoreData .line{
    display:inline-block;
    width:120rpx;
    height:0px;
    border-top:1rpx solid #efefef;
    margin-bottom:7rpx;
}
</style>