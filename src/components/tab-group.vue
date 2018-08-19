<template>
  <div class="tab-group">
    <div class="tab-item" @tap="toggle(1)">
        <div>
            <img v-if="type==1" class="tab-img" src="../../static/images/cart-active.png" alt="">
            <img v-else class="tab-img" src="../../static/images/cart.png" alt="">
        </div>
        
        <div class="text">购物车</div>
    </div>
    <div class="tab-item"  @tap="toggle(2)">
        <div>
            <img v-if="type==2" class="tab-img" src="../../static/images/scan-active.png" alt="">
            <img v-else class="tab-img" src="../../static/images/scan.png" alt="">
        </div>
        <div class="text">扫一扫</div>
    </div>
    <div class="tab-item"  @tap="toggle(3)">
        <div>
            <img v-if="type==3" class="tab-img" src="../../static/images/my-active.png" alt="">
            <img v-else class="tab-img" src="../../static/images/my.png" alt="">
        </div>

        <div class="text">我的</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import MpvueRouterPatch from 'mpvue-router-patch'

Vue.use(MpvueRouterPatch)
export default {
    props:[
        'type'
    ],
    data(){
        return {

        }
    },
    methods:{
        toggle(type){
            if(type==1){
                this.$router.replace({path:'/pages/cart/main'})
         
            }else if(type==2){
                this.$router.replace({path:'/pages/scan/main'})
            }else{
                this.$router.replace({path:'/pages/my/main'})
            }
            
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
