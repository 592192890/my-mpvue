<template>
    <div>
        <!--pages/scan/scan.wxml-->
        <!--<import src="/template/scan-dialog-tpl.wxml"/>-->

        <div class="container">
            <div class="header">
                <div class="search item">
                    <input class="code iconfont" @input="codeChange" placeholder="请手动输入商品条形码" v-model="code"/>
                </div>
                <div class="btn item" @tap="searchCode">
                    <div>查找</div>
                </div>
            </div>

            <div class="gap"></div>

            <div class="scan">
                <div class="tip">
                    您可以手动搜索条码，或者继续扫描商品条码
                </div>
                <div class="scan-btn">
                    <div class="btn" @tap="scanCode">扫一扫</div>
                </div>
            </div>

        </div>
        <tab-group type="2"></tab-group>
    </div>
</template>
<script scoped>
import tabGroup from '../../components/tab-group.vue'
export default {
    components:{
        tabGroup
    },
    data(){
        return {
            hasUncheck:false,
            animationData:{},
            dialogData:{
            quantity:1,
            isCheck:true,
            isTouchMove:false,
            isShow:false,
            },
            isShowIcon:false,
            code:'',
            btcheck:false
        }
    },
    methods:{
        codeChange(){

        },
        searchCode(){

        },
        scanCode(){
            wx.scanCode({
                success: (res) => {
                    var type=res.scanType;
                    console.log(type,'aaaaa')
                    


                },
                fail:(err)=>{
                    console.log(err,'error')
                }
        
            })
        }
    }
}
</script>
<style>
/* pages/scan/scan.wxss */
.icon{
    height: 44rpx;
    width: 44rpx;
    color: yellow;
    border-color: black;
    border-radius: 22rpx;
    border-width: 1rpx;
}
.header{
    height:100rpx;
    width:100%;
}
.header .item{
    display: inline-block;
    height:100rpx;
    width:400rpx;
}
.header .item .code:before{
    content:'\e61a';
    font-size:30rpx;
    position:absolute;
    left:0px;
    padding:0 30rpx;
    color:#999999;
}
.header .item .code{
    height:100rpx;
    line-height:100rpx;
    margin-left:70rpx;
    font-size:28rpx;
    color:#999999;
    width:100%;
}
.header .btn{
    width:200rpx;
    position:absolute;
    top:0px;
    right:30rpx;
    height:100rpx;
    
}
.header .btn view{
    /*background-color: #fede5b;*/
    font-size:30rpx;
    height:60rpx;
    line-height:60rpx;
    /*margin-top:10rpx;*/
    width:100rpx;
    background-color:#ffffff;
    padding:0px;
    position:absolute;
    right:0px;
    top:20rpx;
    border-radius:4rpx;
    color:#333333;
    text-align:center;
    border:1rpx solid #cccccc;
}

.gap{
    height:20rpx;
    background-color:#f6f6f6;
}
.scan{
    text-align:center;
    position:absolute;
    top:50%;
    left:50%;
    width:700rpx;
    z-index:100;
    margin-top:-78rpx;
    margin-left:-350rpx;
}
.scan .tip{
    font-size:30rpx;
    text-align:center;
}
.scan .scan-btn{
    margin-top:80rpx;
    height:88rpx;
}
.scan .scan-btn .btn{
    width:300rpx;
    background-color:#fede5b;
    height:90rpx;
    line-height:90rpx;
    font-size:32rpx;
    border-radius:8rpx;
    margin:0 auto;
}
.animate-icon{
    opacity: 0;
    height:100rpx;
    width:100rpx;
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    z-index:1;
}
.animate-icon.show{
    opacity: 1
}
</style>