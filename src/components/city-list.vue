<template>
    <div class="city-list-container">
        <div :class="{'tips':true,'show':showIndex}" :style="{'top':toTop}">{{showIndex}}</div>
        <div class="index" @click="goIndex">
            <div :data-index="item" v-for="item in alphabet" :key="item">{{item}}</div>
        </div>
        <div class="item" v-for="(outerItem,outerIndex) in listData" :key="outerItem.word">
            <div class="title" :id="outerItem.word">{{outerItem.word}}</div>
            <div class="content">
                
                <div class="city" :class="{'active':innerItem.active&&innerItem.shopNameArr.length>0}" v-for="(innerItem,innerIndex) in outerItem.cityList" :key="innerItem.cityName">
                    <div @click="expandShop(outerIndex,innerIndex)">{{innerItem.cityName}}</div>
                    
                    <div v-for="(shopItem,shopIndex) in innerItem.shopNameArr" v-if="innerItem.active" :key="shopItem.shopId" class="shop-item" :class="{'active':shopItem.selected}" @click="selectShop(shopId,shopIndex,outerIndex,innerIndex)">
                        <span>{{shopItem.shopName}}</span>
                    </div>
                        
                </div>
                
            </div>
        </div>
    </div>
</template>
<script>
import store from '../store/index.js'
export default {
    props:{
        cityArr:{
            type:Array,
            default:()=>{
                []
            }
        },
        
    },
    methods:{
        goIndex: function (e) {
            this.showIndex = e.target.dataset.index;
            this.toTop = e.touches[0].pageY + "px";
            this.toView=this.showIndex;

            setTimeout(function () {
                this.showIndex=null
            }.bind(this), 500)

        },
        expandShop(outerIndex,innerIndex) {
            var newListData=Object.assign([],this.listData);

            var cityList = newListData[outerIndex].cityList;
            
            var cityList = newListData[outerIndex].cityList;
            if (cityList[innerIndex].active) {
                cityList[innerIndex].active = false
            } else {
                cityList[innerIndex].active = true;
            }
            newListData[outerIndex].cityList=cityList;
  
            this.listData = newListData
   
        },
        selectShop(shopId,shopIndex,outerIndex,innerIndex) {
            this.$emit('selectShop')
        },
    },
    data(){
        return {
            listData:this.cityArr,
            showIndex: null,//show select which index word
            toTop:'',
            alphabet:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
        }
    }
}
</script>
<style scoped>
    .tips{
        width:100rpx;
        height:100rpx;
        border-radius: 50%;
        border:1px solid #efefef;
        z-index:100;
        text-align:center;
        line-height:100rpx;
        background-color:#f95d5b;
        color:#ffffff;
        display: none;
    }
    .tips.show{
        display: block;
        position:fixed;
        right:70px;
    }
    .index{
        position:fixed;
        right:0px;
        top:220rpx;
        font-size:24rpx;
        color:#ffffff;
        width:34rpx;
        background-color:#c0c0c0;
        text-align:center;
        z-index:100;
    }
    .item .title{
        padding-left:30rpx;
        font-size:26rpx;
        color:#999999;
        height:64rpx;
        line-height:64rpx;
    }
    .item .content{
        padding-left:30rpx;
        background-color:#ffffff;
        font-size:28rpx;
        color:#333333;
    }
    .item .content .city{
        min-height:86rpx;
        line-height:86rpx;
        border-bottom:1rpx solid #efefef;
    }
    .item .content .city.active{
        min-height:160rpx;
    }
    .item .content .city:last-child{
        border:none;
    }
    .item .content .city .shop-item{
        display: inline-block;
        border:1rpx solid #cccccc;
        border-radius:4rpx;
        font-size:28rpx;
        color:#333333;
        width:30%;
        
        /*overflow:hidden;
        white-space:nowrap;
        text-overflow: ellipsis;*/

        height:90rpx;
        line-height:90rpx;
        text-align:center;
        margin-right:20rpx;
        box-sizing: border-box;

        position:relative;
        margin-top:-10rpx;
    }
    .item .content .city .shop-item text{
        width:80%;
        /*height:80rpx;*/
        display:block;
        line-height:30rpx;
        margin:0 auto;
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        word-wrap:break-word;
    }
    .item .content .city .shop-item.active{
        border:1px solid #f95d5b;
        color:#f95d5b;
    }

</style>