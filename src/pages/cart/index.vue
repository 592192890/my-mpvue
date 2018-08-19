<template>
    <div class="container">
    
        <div class="toggole-shop">
            <div class="arrow" @click="goToggleShop" v-if="!hasUncheck">
                <img src="../../../static/images/bottom-arrow.png">
            </div>
        </div>
        <div class="package-group">
            <div class="package" :class="{'active':selectedPakageIndex==1}"  @click="selectPackage(1,packages.small.barcode)">
                <span class="name">{{packages.small.name}}</span>
                <span class="price">
                    <span style="margin-right:2rpx;display:inline-block">¥</span>
                    <span>{{packages.small.price}}</span>
                </span>
                <!--<div class="tick {{selectedPakageIndex==1?'active':''}}"></div>-->
            </div>
            <div class="package" :class="{'active':selectedPakageIndex==2}" @click="selectPackage(2,packages.mid.barcode)">
                <span class="name">{{packages.mid.name}}</span>
                <span class="price">
                    <span style="margin-right:2rpx;display:inline-block">¥</span>
                    <span>{{packages.mid.price}}</span>
                </span>
                <!--<div class="tick {{selectedPakageIndex==2?'active':''}}"></div>-->
            </div>
            <div class="package" :class="{'active':selectedPakageIndex==3}" @click="selectPackage(3,packages.max.barcode)">
                <span class="name">{{packages.max.name}}</span>
                <span class="price">
                    <span style="margin-right:2rpx;display:inline-block">¥</span>
                    <span>{{packages.max.price}}</span>
                </span>
                <!--<div class="tick {{selectedPakageIndex==3?'active':''}}"></div>-->
            </div>

        </div>
        <!--no goods in cart-->
        <div class="default-tips" v-if="productList.length==0">
            <div class="tip-message">
                <span>
                    扫码购单次可支持购买<span class="number">{{maxSku}}</span>种以内商品
                </span>
                <span>（金卡以上会员任意种数，鲜食演义商品不限件数）</span>

            </div>
            <div class="tip-img">
                <div class="icon scan" @click="goScan">
                    <div class="show scan">
                        <img src="../../../static/images/cart-scan.png">
                    </div>
                </div>
                <div class="arrow">
                    <img src="../../../static/images/arrow.png">
                </div>
                <div class="icon pay">
                    <div class="show pay">
                        <img src="../../../static/images/cart-pay.png">
                    </div>
                </div>
                <div class="arrow">
                    <img src="../../../static/images/arrow.png">
                </div>
                <div class="icon check">
                    <div class="show check">
                        <img src="../../../static/images/cart-check.png">
                    </div>
                </div>
            </div>

            <div class="tip-description">
                <div class="item">
                    <div>扫一扫</div>
                    <div>商品条形码</div>
                </div>
                <div class="item">
                    <div>线上支付</div>
                    <div>轻松付款</div>
                </div>
                <div class="item">
                    <div>自助收银机</div>
                    <div>核检商品离开</div>
                </div>
            </div>
        </div>
        <!--there are goods in cart-->
        <selction class="order-list" v-else>
            <div class="content" v-for="(item,index) in productList" :key="item.barcode">
                <div class="item" :class="{'active':item.isTouchMove}"  @touchstart="drawStart(index,$event)"@touchmove="drawMove(index,$event)" :id="item.barcode">
                    <div class="radio">
                        <span class="new-radio iconfont" :class="{'checked':item.isCheck}" @click.stop="toggleItemSelect(index)"></span>
                    </div>
                    
                    <div class="product-des">
                        <div class="product-name" :class="{'checked':item.isCheck}">
                            <span class="name">
                                <span class="mark" v-if="item.isNew">鲜</span>{{item.productName}}
                            </span>
                        </div>
                        <div class="info">
                            <div class='sum-view'>
                                <span class="sum">¥{{item.amount}}</span>
                            </div>
                            <div class="calculate">
                                <span class="inline minus iconfont" :class="{'disable':item.modqty!='Y'}" @click="minus(item.modqty,index)" ></span>
                                <input type="number" class="inline number" @blur="changeNumber(item.modqty,index)" v-model="item.quantity"/>
                                <span class="inline add iconfont" :class="{'disable':item.modqty=='Y'}" @click="add(item.modqty,index)"></span>
                            </div>
                        </div>

                    </div>

                </div>
                <div class="delete" :class="{'active':item.isTouchMove}" @click="delItem(item.barcode,item.serialNumber)">
                    <span class="delete-label">删除</span>
                </div>
            </div>
            <div class="noMoreData" :class="{'show':noMoreData}">
                <span class="line"></span>
                <span class="label">买买买，我是有底线的</span>
                <span class="line"></span>
            </div>
            <!-- <div class="space" style="height:100rpx;width:100%;background-color:#f6f6f6"></div>-->
  
        </selction>
        <div class="cart-footer">
            <div style="display:inline-block" class="radio" v-if="productList.length>0">
                <span class="all-select new-radio iconfont" :class="{'checked':allSelected}" @click="toggleAllSelect"></span>
                <span class="all-select-label">全选</span>
            </div>

            <div style="display:inline-block" class="name">
                <span>合计：</span>
                <span class="symbol">¥</span>
                <span class="money">{{totalPrice}}</span>
            </div>

            <div class="sum" @click="goSubmitOrder">结算({{selectedProductCount}})</div>
        </div>
        <tab-group type="1"></tab-group>
    </div>
</template>
<script>
import store from '../../store/index.js'
import tabGroup from '../../components/tab-group.vue'
import {calculatePriceBySelectedOrder,wxRequest,getPackageArr} from '../../utils/index.js'
var isSumObj={isSum:false};//in case click sum button
var packageArr=[];
var startWith=store.state.START_WITH; //鲜食演义开头的数字
export default {
    components:{
        tabGroup
    },
    data(){
        return {
            packages:store.state.packages,
            hasUnpaid:false,//whether has unpaid order
            hasUncheck:false,//whether has uncheck order
            orderId:'',//uncheck order id
            selectedPakageIndex:0,   //pakage index (1:small package;2:middle package;3:big pakacge)
            productList:[],
            totalPrice:0,   //total price
            allSelected:false,    //allSelect radio

            noMoreData:false,

            selectedProductCount:0, //selected product count
            identifyCode:null,
            maxSku:store.state.maxSku,
            startX: 0, //开始坐标
            startY: 0
        }
    },
    methods:{
        selectPackage:function(index,barcode){
            
            var isExist=this.isExistPackageByIndex(index);
            if(!isExist){
                //push package object to productList
                var packageObj=packageArr[index-1];
                packageObj.price=parseFloat(packageObj.price).toFixed(2);
                packageObj.amount=packageObj.price;
                packageObj.sum=parseFloat(packageObj.price).toFixed(2);
                packageObj.isCartBag = true;
                this.productList.push(packageObj);

                console.log(this.productList,'aaaaaaaaaaa')
                var previousIndex=this.selectedPakageIndex;
                //calculate total price
                var totalPrice=parseFloat(this.totalPrice);
                var currentPackagePrice=this.calculatePackagePriceByIndex(index);
                var previousPackagePrice=this.calculatePackagePriceByIndex(previousIndex);
                // expand number to add and minus
                var newSumPrice=parseFloat(totalPrice)+parseFloat(currentPackagePrice);

     
                for(var i=0;i<this.productList.length;i++){
                    var item=this.productList[i];
                    if(!item.isCheck){
                        this.allSelected=false;
                        break;
                    }
                }
                this.totalPrice=newSumPrice.toFixed(2);
                
                this.selectedProductCount=this.selectedProductCount+1;
            }
            this.selectedPakageIndex=index
            //store cart
            var shopId='1234';
            var cart=wx.getStorageSync('cart')||{};

            cart[shopId]=this.productList;
            wx.setStorageSync('cart',cart);

        },
        toggleAllSelect:function(){
            var value=this.allSelected?false:true;

            //calculate selected product count
            var selectedProductCount=0;
            if(value){
                selectedProductCount=this.productList.length;
            }
            this.productList.forEach(function(itemValue,index){
                itemValue.isCheck=value;
            });
            var sumPrice=calculatePriceBySelectedOrder(this.productList);
            // sumPrice+=this.calculatePackagePriceByIndex(this.selectedPakageIndex);
            this.allSelected=value;
   
            this.totalPrice=parseFloat(sumPrice).toFixed(2);
            this.selectedProductCount=selectedProductCount;
            //store cart
            var shopId=wx.getStorageSync('configData').shopId;
            var cart=wx.getStorageSync('cart')||{};
            cart[shopId]=this.productList;
            wx.setStorageSync('cart',cart);
        },
        toggleItemSelect:function(index){
            var item=this.productList[index];

            var allSelected=false;

            //calculate selected product count
            // var selectedProductCount=this.selectedProductCount;

            if(item.isCheck){
                item.isCheck=false;
                this.selectedProductCount--;
            }else{
                item.isCheck=true;
                this.selectedProductCount++;
            }
            var sumPrice=calculatePriceBySelectedOrder(this.productList);

            if(this.selectedProductCount==this.productList.length){
                this.allSelected=true;
            }
            this.totalPrice=parseFloat(sumPrice).toFixed(2)
            //store cart
            var shopId=wx.getStorageSync('configData').shopId;
            var cart=wx.getStorageSync('cart')||{};

            cart[shopId]=this.productList;
            wx.setStorageSync('cart',cart);

        },
        minus:function(isweight,index){
           
            var item=this.productList[index];

            if(item.quantity>1){
                item.quantity--;
                item.sum=(parseFloat(item.quantity)*parseFloat(item.amount)).toFixed(2);

                //if product is selected,calculate all selected products list' sumprice;or don't
                if(item.isCheck){
                    var totalPrice=calculatePriceBySelectedOrder(this.productList);
                    this.totalPrice=parseFloat(totalPrice).toFixed(2)
                }

                //store cart
                var shopId=wx.getStorageSync('configData').shopId;
                var cart=wx.getStorageSync('cart')||{};

                cart[shopId]=this.productList;
                wx.setStorageSync('cart',cart);
            }else{
            item.isTouchMove=true;
  
            }
        },
        add:function(isweight,index){
           
            var item=this.productList[index];
            if(item.quantity<100){
            item.quantity++;
            item.sum=(parseFloat(item.quantity)*parseFloat(item.amount)).toFixed(2);

            //if product is selected,calculate all selected products list' sumprice;or don't
            if(item.isCheck){
                var totalPrice=calculatePriceBySelectedOrder(this.productList);
                this.totalPrice=parseFloat(totalPrice).toFixed(2)
                
            }
            //store cart
            var shopId=wx.getStorageSync('configData').shopId;
            var cart=wx.getStorageSync('cart')||{};

            cart[shopId]=this.productList;
            wx.setStorageSync('cart',cart);
            }
        },
        changeNumber:function(isweight,index){
            //judge whether can weight
            if(isweight=='N'||!isweight){
                
                return;
            }
            var changeNumber=e.detail.value;
            var totalPrice=0;
           
            var item=this.productList[index];
            if(/^\d*$/.test(changeNumber)&&changeNumber>=1&&changeNumber<=100){
            item.quantity=changeNumber;
            item.sum=(parseFloat(item.quantity)*parseFloat(item.amount)).toFixed(2);


            for(var i in this.productList){
                var item = this.productList[i];
                if(item.isCheck){
                totalPrice=parseFloat(totalPrice)+parseFloat(item.amount)*parseFloat(item.quantity);
                }
            }
            this.totalPrice=parseFloat(totalPrice).toFixed(2)
            

            //store cart
            var shopId=wx.getStorageSync('configData').shopId;
            var cart=wx.getStorageSync('cart')||{};

            cart[shopId]=this.productList;
            wx.setStorageSync('cart',cart);

            }else{
                wx.showModal({
                    title: '错误',
                    showCancel:false,
                    content: '商品数量只能输入1到100的正整数',
                    confirmColor:'#f95d5b',
                    success:function(){
                        
                
                    }.bind(this)
                })
            }
        },
        calculatePackagePriceByIndex(index){
            var packagePrice=0;
            if(index==1){
                packagePrice=this.packages.small.price;
            }
            if(index==2){
                packagePrice=this.packages.mid.price
            }
            if(index==3){
                packagePrice=this.packages.max.price;
            }
            return packagePrice
        },
        goSubmitOrder:function(){
            if(!isSumObj.isSum){

            if (!this.selectedProductCount) {
                wx.showModal({
                title: '提示',
                content: '必须选择商品才能结算',
                showCancel: false,
                confirmColor: '#f95d5b',
                success: function () {
                    isSumObj.isSum = false;
                    if (wx.hideLoading) {
                    wx.hideLoading();
                    }
                }.bind(this)
                })
                return false;
            }
            
            }else{
                isSumObj.isSum=true
            }

            if(wx.showLoading){
            wx.showLoading({
                title: '结算中',
                mask:true
            })
            }
            //判断是否既有鲜食演义商品也有其他商品
            var hasNewPro=false;
            var hasOtherPro=false;
            var fresh_food_class=wx.getStorageSync('configData').fresh_food_class||startWith;

            for(var i=0;i<this.productList.length;i++){
            var item=this.productList[i];
            if(item.isCheck){
                if(fresh_food_class.indexOf(item.dept)!=-1){
                hasNewPro=true
                }else{
                hasOtherPro=true
                }
            }
            }
            if(hasNewPro&&hasOtherPro){
            wx.showModal({
                title: '提示',
                content: '鲜食演义的商品请单独下单（暂不支持鲜食演义与超市其他商品一起下单）。',
                showCancel:false,
                confirmColor:'#f95d5b',
                success:function(){
                isSumObj.isSum=false
                }.bind(this)
            })
            if(wx.hideLoading){
                wx.hideLoading();
            }
            return false;
            }else if(hasNewPro&&!hasOtherPro){
            //鲜食演义任何时候都可以下单
            }else if(!hasNewPro&&hasOtherPro){
            if(this.hasUnpaid){
                wx.showModal({
                title: '提示',
                content: '你有待付款订单，不能结算！（只有鲜食演义商品可以继续结算）',
                showCancel:false,
                confirmColor:'#f95d5b',
                success:function(){
                    isSumObj.isSum=false
                }.bind(this)
                })
                if(wx.hideLoading){
                wx.hideLoading();
                }
                return false;
            }
            if(this.hasUncheck){
                wx.showModal({
                title: '提示',
                content: '你有待核检订单，不能结算！（只有鲜食演义商品可以继续结算）',
                showCancel:false,
                confirmColor:'#f95d5b',
                success:function(){
                    isSumObj.isSum=false
                }.bind(this)
                })
                if(wx.hideLoading){
                wx.hideLoading();
                }
                return false;
            }
            }
            if(!this.selectedProductCount){
            wx.showModal({
                title: '提示',
                content: '必须选择商品才能结算',
                showCancel:false,
                confirmColor:'#f95d5b',
                success:function(){
                isSumObj.isSum=false;
                if(wx.hideLoading){
                    wx.hideLoading();
                }
                }.bind(this)
            })

            return false;
            }

            //judge member level,if user isn't vip,only select 4 products
            var packageObj=wx.getStorageSync('configData').Shopbag;
            var fourProduct=this.productList.filter(function(value,index){
            if(value.isCheck&&value.barcode!=packageObj.min.barcode&&value.barcode!=packageObj.mid.barcode&&value.barcode!=packageObj.max.barcode){
                value.quantity=value.quantity.toString();
                return value;
            }
            });
            var userLevel=wx.getStorageSync('member').tier;
            var defaultLevel=wx.getStorageSync('configData').card_level_default;
            //鲜食演义商品不做限制
            if(hasOtherPro&&!hasNewPro){
            if(defaultLevel.indexOf(userLevel)!=-1||!userLevel){
                if(fourProduct.length>this.maxSku){
                    if(wx.hideLoading){
                        wx.hideLoading();
                    }
                    wx.showModal({
                        title:'提示',
                        showCancel:false,
                        content:'目前仅支持购买'+this.maxSku+'件及以下商品。（鲜食演义商品不限件数）',
                        success:function(){
                        isSumObj.isSum=false
                        }.bind(this)
                    })
                    return;
                }
            }else{
                if(fourProduct.length>50){
                if(wx.hideLoading){
                    wx.hideLoading();
                }
                wx.showModal({
                    title:'提示',
                    showCancel:false,
                    content:'目前仅支持金卡会员购买50件及以下的非购物袋商品。（鲜食演义商品不限件数）',
                    success:function(){
                    isSumObj.isSum=false
                    }.bind(this)
                })
                return;
                }
            }
            }

            //get seleced product list's object
            var selectedproductList=this.productList.filter(function(value,index){
            if(value.isCheck){
                value.quantity=value.quantity.toString();
                return value;
            }
            });
            //get unSeleced product list's object
            var unSelectedproductList=this.productList.filter(function(value,index){
            if(!value.isCheck){
                value.quantity=value.quantity.toString();
                return value;
            }
            });

            var shopId=wx.getStorageSync('configData').shopId;

            var storedUnSelectedCart=wx.getStorageSync('unSelectedCart')||{};

            storedUnSelectedCart[shopId]=unSelectedproductList

            wx.setStorageSync('unSelectedCart',storedUnSelectedCart);

            //判断是鲜食演义还是其他
            var orderType='0';
            if(fresh_food_class.indexOf(selectedproductList[0].dept)!=-1){
            orderType='1';
            }
            var obj={
                url:store.state.apiUrl.balanceOrderUrl,
            data:{
                items:JSON.stringify(selectedproductList),
                shopId:wx.getStorageSync('configData').shopId,
                orderType:orderType
            },
            isSumObj:isSumObj,
            success:function(result){
                //store submitData
                var submitOrderArr=result.data.data;
                wx.setStorageSync('submitOrder',submitOrderArr);
                wx.navigateTo({
                    url:'/pages/submit-order/submit-order'
                })

            }.bind(this),
            fail:function(err){
                isSumObj.isSum=false
            }.bind(this)
            }
            wxRequest(obj);



        },
        goScan:function(e){
            this.$router.push({ path: '/pages/scan/main' })

        },
        isExistPackageByIndex:function(index){
            var isExist=false;

            var packageIndex=index;
            var productName='';
            if(packageIndex==1){
                productName="小购物袋";
            }
            if(packageIndex==2){
                productName="中购物袋";
            }
            if(packageIndex==3){
                productName="大购物袋";
            }
           
            for(var i=0;i<this.productList.length;i++){
                var item=this.productList[i];
                if(item.productName==productName){
                    item.isCartBag = true;
                    isExist=true;
                    break;
                }
            }

            return isExist;
        },
        // left slide to delete
        drawStart(index,e){
            this.productList.forEach(function (v, i) {
                if (v.isTouchMove)
                v.isTouchMove = false;
            })
            this.startX=e.touches[0].clientX;
            this.startY=e.touches[0].clientY;
        },
        drawMove(index,e){
            
            var startX = this.startX;//开始X坐标
            var startY = this.startY;//开始Y坐标
            var touchMoveX = e.touches[0].clientX;//滑动变化坐标
            var touchMoveY = e.touches[0].clientY;//滑动变化坐标
            //获取滑动角度
            var angle = this.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
            this.productList.forEach(function (v, i) {
            v.isTouchMove = false
            //滑动超过30度角 return
            if (Math.abs(angle) > 30) {
                return;
            };
            if (i == index) {
                if (touchMoveX > startX){//右滑
                    v.isTouchMove = false
                }else{//左滑
                    v.isTouchMove = true
                }

            }
            })

           
        },
        /**
        * 计算滑动角度
        * @param {Object} start 起点坐标
        * @param {Object} end 终点坐标
        */
        angle: function (start, end) {
            var _X = end.X - start.X,
            _Y = end.Y - start.Y
            //返回角度 /Math.atan()返回数字的反正切值
            return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
        },
        //delete item
        delItem: function(dataBarCode,serialNumber){

            //if delete current package,must to judge the value of this.selectedPakageIndex
            var newSelectedPakageIndex=0;

            var packageBarCodeArr=this.getPackageBarCodeArr();

            var index=packageBarCodeArr.indexOf(dataBarCode);
            if(index!=-1){//if delete package
                var currentPackageIndex=this.selectedPakageIndex;
                if((index+1)==currentPackageIndex){
                    newSelectedPakageIndex=0;
                }else{
                    newSelectedPakageIndex=currentPackageIndex
                }
            }
            var totalPrice=0;
            var selectedProductCount=0;
            var productList = this.productList;
            var newProductList = [];

            for(var i in productList){
                var item = productList[i];
                if(item.barcode != dataBarCode){
                newProductList.push(item);

                if(item.isCheck){
                    if(item.modqty=='Y'){
                    totalPrice=parseFloat(totalPrice)+parseFloat(item.amount)*parseFloat(item.quantity);
                    }else{
                    totalPrice=parseFloat(totalPrice)+parseFloat(item.amount);
                    }

                    selectedProductCount++;
                }

                }else{
                if(serialNumber){
                    if(serialNumber!=item.serialNumber){
                    newProductList.push(item);

                    if(item.isCheck){
                        if(item.modqty=='Y'){
                        totalPrice=parseFloat(totalPrice)+parseFloat(item.amount)*parseFloat(item.quantity);
                        }else{
                        totalPrice=parseFloat(totalPrice)+parseFloat(item.amount);
                        }

                        selectedProductCount++;
                    }
                    }
                }
                }
            }


            if(selectedProductCount==newProductList.length){
                this.allSelected=true;
            }

            this.productList=newProductList;
            this.noMoreData=newProductList.length>0?this.noMoreData:false;
            this.totalPrice=parseFloat(totalPrice).toFixed(2);
            this.selectedPakageIndex=newSelectedPakageIndex;
            this.selectedProductCount=selectedProductCount;
        
            //store cart
            var shopId=wx.getStorageSync('configData').shopId;
            var cart=wx.getStorageSync('cart')||{};

            cart[shopId]=this.productList;
            wx.setStorageSync('cart',cart);
        },
        getPackageBarCodeArr:function(){
            var result=[]
            // var cache=wx.getStorageSync('configData').Shopbag;
            var cache = store.state.packages;
            result.push(cache.small.barcode);
            result.push(cache.mid.barcode);
            result.push(cache.max.barcode);


            return result;
        },
        goToggleShop:function(){
            this.$router.replace({path:"/pages/shop/main", query: { type:'toggle' } })
         
        },
 
    },
    mounted:function(){
        isSumObj.isSum=false;
        packageArr=getPackageArr();

        var shopId='12345';

        if(wx.showLoading){
        wx.showLoading({
            title:'加载中',
            mask:true
        })
        }
        //copy from onLoad
        var selectedCount=0;
        var totalPrice=0;

        var cartCache=wx.getStorageSync('cart')[shopId];
        //此处为购物车数据  在这里面取商品图片地址
        if(cartCache){
            /* productList=cartCache;*/
            for(var i=0;i<cartCache.length;i++){
                var item=cartCache[i];
                var indexCarBag = item.productName.indexOf("购物袋");
                if (indexCarBag > 0) {
                item.isCartBag = true;
                } else {
                item.isCartBag = false;
                }
                this.productList.push(item);
                if(item.isCheck){
                    selectedCount++;
                    //判断是否是称重 商品
                    if(item.modqty=='Y'){
                    totalPrice=parseFloat(totalPrice)+parseFloat(item.amount)*parseFloat(item.quantity);
                    }else{
                    totalPrice=parseFloat(totalPrice)+parseFloat(item.amount);
                    }

                }
            }
        }
      
        if(selectedCount==this.productList.length){
            this.allSelected=true;
        }
        this.selectedProductCount=selectedCount;
        this.totalPrice=parseFloat(totalPrice).toFixed(2);


        
        //judge whether clear cart
        this.productList=wx.getStorageSync('cart')[shopId]||[]

        wx.hideLoading();
       

        wx.setNavigationBarTitle({
            title: '金星店'
        });
    },
    onReachBottom:function(){
        if(this.productList.length>=4){
        this.setData({
            noMoreData:true
        })
        }
    }

}   
</script>

<style scoped>
    page{
        background-color:#f6f6f6;
    }
    /******identify code css***********/
    .container{
        overflow:hidden;
        padding:0px;
    }

    /********************************************************************/
    .toggole-shop{
        position:absolute;
        top:0px;
        height:50rpx;
        width:100%;
    }
    .toggole-shop .arrow{
        height:50rpx;
        width:300rpx;
        margin:0 auto;
        position:relative;
    }
    .toggole-shop .arrow image{
        width:120rpx;
        height:30rpx;
        position:absolute;
        left:50%;
        transform:translateX(-50%);

    }
    /*.toggole-shop .arrow:after{
        content:'\e623'
    }*/
    .package-group{
        display: flex;
        display: -webkit-flex;
        padding:50rpx 30rpx 50rpx 30rpx;
        background-color:#ffffff;
        width:100%;
        margin-bottom:20rpx;
        box-sizing:border-box;
        -webkit-box-sizing: border-box;
    }
    .package-group .package{
        flex:1;
        text-align:center;
        border:1px solid  #efefef;
        margin-right:16rpx;
        /*width:220rpx;*/
        height:100rpx;
        border-radius:4rpx;

    }
    .package-group .package.active{
        border-color:#f95d5b;
        /*position: relative;*/
    }
    .package-group .package .tick{
        display: none;
        width:32rpx;
        height:32rpx;
        background-color:#f95d5b;
    }
    .package-group .package .tick.active{
        display: block;
        position:absolute;
        top:0px;
        right:0px;
        border-bottom-left-radius:100%;
    }
    .package-group .package.active .price{
        color:#f95d5b;
    }
    .package-group .package .name{
        font-size:28rpx;
        display:block;
        margin-top:16rpx;
        margin-bottom:10rpx;
        color:#666666;
        height:28rpx;

        /*font-weight:300;*/
    }
    .package-group .package .price{
        font-size:30rpx;
        display:block;
        /*font-weight: bold;*/
        color:#333333;
        height:30rpx;
    }
    .package-group .package:last-of-type{
        margin-right:0px;
    }
    .gap{
        height:20rpx;
        background-color:#f6f6f6;
        width:100%;
    }
    .default-tips{
        display: block;
        overflow:hidden;
        background-color:#ffffff;
        height:calc(100vh - 420rpx);
        padding-top:130rpx;
    }

    .default-tips .tip-message{
        font-size:30rpx;
        text-align: center;
        color:#333333;
    }
    .default-tips .tip-img{
        padding-top:110rpx;
        display: flex;
        display: -webkit-flex;
    }

    .default-tips .tip-img .icon{
        height:104rpx;
        flex:2;
    }
    .default-tips .tip-img .icon.scan{
        margin-left:30rpx;
    }
    .default-tips .tip-img .icon.check{
        margin-right:30rpx;
    }
    .default-tips .tip-img .icon .show{
        width:104rpx;
        height:104rpx;
        border-radius:50%;
        background-color:#f7f7f7;
        margin-left:73rpx;

    }
    .default-tips .tip-img .icon .show image{
        width:40rpx;
        height:40rpx;
        margin-left:32rpx;
        margin-top:32rpx;
    }
    .default-tips .tip-img .icon .show.pay{
        margin-left:53rpx;
    }
    .default-tips .tip-img .icon .show.check{
        margin-left:43rpx;
    }
    .default-tips .tip-img .arrow{
        line-height:104rpx;
    }
    .default-tips .tip-img .arrow image{
        width:40rpx;
        height:10rpx;
    }
    .tip-description{
        display: flex;
        display: -webkit-flex;
        margin-bottom:140rpx;
        margin-top:20rpx;
        color:#666666;

    }
    .tip-description .item{
        flex:1;
        text-align:center;
        font-size:28rpx;
    }
    .tip-description .item:first-child{
        margin-left:30rpx;
    }
    .tip-description .item:last-child{
        margin-right:30rpx;
    }
    .tip-message .number{
        color:#f95d5b;
    }

    .order-list{
        display: block;
        /*margin-top:200rpx;*/
        /*margin-bottom:98rpx; */
        /*height:calc(100vh - 320rpx);*/
        width:100%;
        background-color:#ffffff;
    }
    .order-list .content{
        position:relative;
        overflow:hidden;
    }
    .order-list .item{
        display: flex;
        display: -webkit-flex;

        border-bottom:1rpx solid #efefef;
        margin:0px 0px 0px 30rpx;
        position:relative;
        -webkit-transition: all 0.4s;
        transition: all 0.4s;
    }
    .order-list .item.active{
        transform: translateX(-180rpx);
        -webkit-transform: translateX(-180rpx);
    }
    .order-list .delete{
        position:absolute;
        right:-180px;
        top:0px;
        bottom:0px;
        width:180rpx;
        text-align: center;
        background-color:#f95d5b;
        color:#ffffff;
    }
    .order-list .delete.active{
        right:0px;
        -webkit-transition: all 0.4s;
        transition: all 0.4s;
    }
    .order-list .delete .delete-label{
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        -webkit-transform:translate(-50%,-50%);
    }
    .order-list .radio{
        margin-top:60rpx;
        flex:1;
    }
    .order-list .product-des{
        flex:10;
        margin-top:28rpx;
        margin-bottom:25rpx;
        /*height: 135rpx;*/
        flex-direction:column;
        justify-content:space-between;

    }
    .product-img-view{
        margin:30rpx 30rpx 20rpx 30rpx;
        width: 140rpx;
        height: 140rpx;

    }
    /*
    .product-img-view image{
        width: 58rpx;
        height: 58rpx;
    }*/
    .order-list .product-des .product-name{
        min-height:30rpx;
        overflow:hidden;
        text-overflow: ellipsis;
        margin-left: 0rpx;
        margin-right:30rpx;
        font-size:30rpx;
    }
    .order-list .product-des .product-name .mark{
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
    .order-list .product-des .product-name .name{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .order-list .product-des .product-name.checked{
        color:#333333;
    }
    .order-list .product-des .weight{
        font-size:26rpx;
        min-height:26rpx;
        color:#999999;
        margin-top:6rpx;
    }
    .order-list .product-des .weight.hidden{
        opacity: 0;
    }
    .order-list .product-des .price{
        font-size:28rpx;
        min-height:28rpx;
        margin-top:20rpx;

    }
    .order-list .product-des .price.checked{
        color:#333333;
    }

    .order-list .calculate{
        display: flex;
        align-items:flex-end;
        margin-right: 30rpx;
    }
    .info{
        display: flex;
        justify-content:space-between;
        align-items:flex-end;
        position:absolute;
        height:60rpx;
        right:0rpx;
        left:255rpx;
        bottom:25rpx;
    }
    .sum-view{
        flex:10;
        margin-bottom: 0rpx;
        margin-left: 0rpx;
    }
    .sum{
        color:#f95d5b;
    }
    .order-list .calculate .inline{

        display: inline-block;
        width:52rpx;
        height:54rpx;
        text-align: center;
        line-height:54rpx;
        vertical-align:middle;
        border:2rpx solid #efefef;

    }
    .order-list .calculate .inline.minus{
        border-top-left-radius:5rpx;
        border-bottom-left-radius:5rpx;
    }
    .order-list .calculate .inline.minus:after{
        content:'\e75b';
        font-size:24rpx
    }
    .order-list .calculate .inline.minus.disable:after{
        color:#cccccc;
    }
    .order-list .calculate .inline.add{
        border-top-right-radius:5rpx;
        border-bottom-right-radius:5rpx;
    }

    .order-list .calculate .inline.add:after{
        content:'\e75c';
        font-size:24rpx
    }
    .order-list .calculate .inline.add.disable:after{
        color:#cccccc
    }
    .order-list .calculate .number{
        width:74rpx;
        border-left-width:0px;
        border-right-width:0px;
        font-size: 28rpx;

    }
    .cart-footer{
        position:fixed;
        bottom:100rpx;
        width:100%;
        height:100rpx;
        /*border-top:1px solid #efefef;*/
        padding-left:30rpx;
        z-index:100;
        background-color:#ffffff;
        color:#333333;
        box-shadow:0px -2rpx 20rpx #efefef;
        -webkit-box-shadow:0px -2rpx 20rpx #efefef;
        box-sizing:border-box;
        -webkit-box-sizing: border-box;
        overflow:hidden;
        vertical-align:middle;
    }
    .cart-footer .radio{
        font-size: 26rpx;
        position:relative;
        top:-1rpx;
    }
    .cart-footer .all-select{
        width:38rpx;
        height:38rpx;
        margin-top:-54rpx;
        position:fixed;
        bottom:42rpx;
        left:30rpx;

    }
    .cart-footer .radio{
        margin-right:30rpx;

    }
    .cart-footer .all-select-label{
        vertical-align:middle;
        color:#333333;
        padding-left:68rpx
    }
    .cart-footer .name{
        font-size:26rpx;
        line-height:100rpx;
        height:100rpx;
        /*font-weight: bold;*/
        color:#333333;
    }
    .cart-footer .name .symbol{
        color:#f95d5b;
        padding-right:4rpx;
    }
    .cart-footer .name .money{
        color:#f95d5b;
        font-size:32rpx;
    }
    .cart-footer .sum{
        float:right;
        width:200rpx;
        height:100rpx;
        background-color:#f9df72;
        font-size:32rpx;
        color:#333333;
        line-height:100rpx;
        text-align:center;
    }

    .new-radio:after{
        content:'\e616';
        font-size:48rpx;
        color:#cccccc;
    }
    .new-radio.checked{
        display: inline-block;
    }
    .new-radio.checked:after{
        content:'\e617';
        font-size:48rpx;
        color:#666666;
    }
    .noMoreData{
        display: none;
        text-align:center;
        height:40rpx;
        color:#999999;
        font-size:26rpx;

    }
    .noMoreData{
        padding-top:30rpx;
        padding-bottom:30rpx;
    }
    .noMoreData.show{
        display: block;

    }
    .noMoreData .label{
        display: inline-block;
        margin-left:20rpx;
        margin-right:20rpx;
        line-height:40rpx;

    }
    .noMoreData .line{
        display:inline-block;
        width:60rpx;
        height:0px;
        border-top:1rpx solid #efefef;
        margin-bottom:7rpx;
    }

</style>