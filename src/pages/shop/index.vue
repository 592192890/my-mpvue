<template>
    <div>
        
       <!-- <scroll-view scroll-y="true" style="height: 100vh;" :scroll-into-view="toView">-->
            <div class="lbs-result" v-if="isLBS" id="header">
                <div class="header">当前门店</div>
                <div class="lbs">
                    <div class="item left">{{tips}}</div>
                    <div class="item right" @click="reLocation">
                        <span>重新定位</span>
                        <img src="../../../static/images/lbs.png">
                    </div>
                </div>
            </div>
            <city-list v-if="isShowCityList" :cityArr="cityArr" @selectShop="selectShop"></city-list>
            <div class="noMoreData">
                <span class="line"></span>
                <span class="label">更多店铺正在开放中，敬请关注</span>
                <span class="line"></span>
            </div>
        <!--</scroll-view>-->
    
    </div>
</template>
<script>
 
    import { wxRequest } from '../../utils/index.js';
    import store from '../../store/index.js'
    import cityList from '../../components/city-list.vue'
    var canLocation = {
        'status': true
    };//user can't click frequently
    var canSelectShop = true;//是否可以手工选择店铺
    export default {
        components:{
            cityList
        },
        data(){
            return {
                isShowCityList: false,
               
                toView: '',
                
                cityArr: [],
                toTop: '',
                tips: '定位中...',
                isLBS: true
            }
        },
        methods:{
            selectShop: function (result) {
                this.$router.replace({ path: '/pages/cart/main'})
            },
            
            getDefaultShop: function () {
                if (!canSelectShop) {
                return;
                }    
                if (wx.showLoading) {
                wx.showLoading({
                    title: '加载中',
                    mask: true
                })
                }
                //get config
                var obj = {
                url: store.state.apiUrl.getConfigUrl,
                data: {
                    shopId: wx.getStorageSync('shopId')
                },
                success: function (result) {
                    var currentPage = getCurrentPages()[getCurrentPages().length - 1].route || getCurrentPages()[getCurrentPages().length - 1].__route__;
                    if (currentPage != 'pages/shop/shop') {
                    return;
                    }
                    wx.setStorageSync('configData', result.data.data);
                    this.$router.push({ path: '/pages/cart/cart' })
                    // wx.switchTab({
                    // url: '/pages/cart/cart'
                    // })
                }
                };
                wxRequest(obj);
            },
            reLocation: function (e) {
                if (!canLocation.status) {
                    return;
                } else {
                    canLocation.status = false;
                }
                this.tips='定位中...'
                wx.getLocation({
                    type: 'wgs84',
                    success: function (res) {
                        canSelectShop = false;

                        var latitude = res.latitude;
                        var longitude = res.longitude;
                        var accuracy = res.accuracy;

                        var lbsObj = {
                        locationStatus: canLocation,
                        url: store.state.apiUrl.getShopLBSUrl,
                        data: {
                            latitude: latitude,
                            longitude: longitude,
                            accuracy: accuracy
                        },

                        success: function (result) {

                            var shopId = result.data.data.shopId;
                            if (shopId == 0) {
                            this.tips = '定位失败，请手动选择门店。';
                            

                            canSelectShop = true;
                            canLocation.status = true;
                            } else {
                            //success
                            //get config
                            var obj = {
                                url: store.state.apiUrl.getConfigUrl,
                                data: {
                                shopId: shopId
                                },
                                success: function (result) {
                                var currentPage = getCurrentPages()[getCurrentPages().length - 1].route || getCurrentPages()[getCurrentPages().length - 1].__route__;
                                if (currentPage != 'pages/shop/shop') {
                                    if (wx.hideLoading) {
                                    wx.hideLoading();
                                    }
                                    canSelectShop = true;
                                    return;
                                }
                                if (wx.showLoading) {
                                    wx.showLoading({
                                    title: '加载中',
                                    mask: true
                                    })
                                }
                                wx.setStorageSync('configData', result.data.data);
                                this.$router.push({ path: '/pages/cart/cart' })
                                // wx.switchTab({
                                //     url: '/pages/cart/cart'
                                // })
                                canSelectShop = true;
                                canLocation.status = true;
                                }
                            };
                            wxRequest(obj);
                            }
                        }.bind(this)
                        }
                        wxRequest(lbsObj);
                    }.bind(this),
                    fail: function (err) {
                        canSelectShop = true;
                        canLocation.status = true;
                        if (err.errMsg == "getLocation:fail auth deny") {
                            this.tips='您已拒绝定位授权。'
                        } else {
                            this.tips='未开启定位功能，请手动选择门店'

                        }
                    }.bind(this)
                })
            },
        },
        onLoad(options){
        
            if (options.type) {
                this.isLBS=false
            }
        
            this.cityArr = store.state.cityList;
            this.cityArr.forEach((v,i)=>{
                v.cityList.forEach((vv,ii)=>{
                    vv.active=false;
                })
            })
           
            this.isShowCityList = true;
            //切换门店不执行定位
            if (!options.type) {
                //lbs location
                wx.getLocation({
                    type: 'wgs84',
                    success: function (res) {
                        canSelectShop = false;
                        var currentPage = getCurrentPages()[getCurrentPages().length - 1].route || getCurrentPages()[getCurrentPages().length - 1].__route__;
                        if (currentPage != 'pages/shop/shop') {
                            canSelectShop = true;
                            return;
                        }
                        var latitude = res.latitude;
                        var longitude = res.longitude;
                        var accuracy = res.accuracy;


                        var lbsObj = {
                            url: store.state.apiUrl.getShopLBSUrl,
                            data: {
                                latitude: latitude,
                                longitude: longitude,
                                accuracy: accuracy
                            },
                            success: function (result) {
                                var shopId = result.data.data.shopId;
                                if (shopId == 0) {
                                    this.tips = '定位失败，请手动选择门店。';
                                    
                                    canSelectShop = true;
                                } else {
                                    //success
                                    //get config
                                    var obj = {
                                        url: store.state.apiUrl.getConfigUrl,
                                        data: {
                                            shopId: shopId
                                        },
                                        success: function (result) {
                                            var currentPage = getCurrentPages()[getCurrentPages().length - 1].route || getCurrentPages()[getCurrentPages().length - 1].__route__;
                                            if (currentPage != 'pages/shop/shop') {
                                                canSelectShop = true;
                                                return;
                                            }

                                            wx.setStorageSync('configData', result.data.data);
                                            this.$router.push({ path: '/pages/cart/cart' })
                                            // wx.switchTab({
                                            //     url: '/pages/cart/cart'
                                            // })
                                            canSelectShop = true;
                                        }
                                    };
                                    wxRequest(obj);
                                }
                            }.bind(this)
                        }
                        wxRequest(lbsObj);

                    }.bind(this),
                    fail: function (err) {
                        canSelectShop = true;
                        if (err.errMsg == "getLocation:fail auth deny") {
                            this.tips='您已拒绝定位授权。'
                        } else {
                            this.tips='未开启定位功能，请手动选择门店'

                        }
                    }.bind(this)
                })
            } else if (options.type == "fromBBGPlus") {
                this.getDefaultShop()
            }
        },
        created(){
            console.log('created')
        }
    }
</script>
<style scoped>
page{
    background-color:#f6f6f6;
}
.lbs-result .header{
    font-size:26rpx;
    color:#999999;
    height:60rpx;
    line-height:60rpx;
    margin-left:30rpx;
}
.lbs-result .lbs{
    display:flex;
    justify-content: space-between;
    padding-left:30rpx;
    padding-right:30rpx;
    background-color:#ffffff;
    height:80rpx;
    line-height:80rpx;
}
.lbs-result .item{
    
    font-size:28rpx;
}
.lbs-result .item.left{
    color:#f95d5b;
    flex:3;
}
.lbs-result .item.right{
    color:#666666;
    text-align:right;
    position:relative;
    padding-right:30rpx;
    flex:1

}
.lbs-result .item.right text{
    margin-right:10rpx;
}
.lbs-result .item.right image{
    width:38rpx;
    height:38rpx;
    position:absolute;
    top:50%;
    transform:translateY(-50%);
}


.noMoreData{

    text-align:center;
    height:40rpx;
    color:#999999;
    font-size:26rpx;
    
}
.noMoreData{
    padding-top:60rpx;
    padding-bottom:100rpx;
}


.noMoreData .label{
    display: inline-block;
    margin-left:20rpx;
    margin-right:20rpx;
}
.noMoreData .line{
    display:inline-block;
    width:60rpx;
    height:0px;
    border-top:1rpx solid #cccccc;
    margin-bottom:7rpx;
    line-height:40rpx;
}
</style>