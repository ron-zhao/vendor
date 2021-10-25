<style lang="sass" scoped rel="stylesheet/sass">
    @import '../../common/sass/var.sass'
    .home-page
        overflow: hidden
        padding-bottom: 50px

    h1
        font-size: $large
        padding: 15px 15px 0

    .home-block
        background-color: #fff
        margin: 12px 0

    .home-layout
        margin-top: 12px

        label
            margin-top: 13px

    .grid-info, .grid-icon, .grid-image
        width: 50px
        height: 50px
        position: relative

    .grid-info >
        .grid-icon, .grid-image
            position: absolute
            top: 0
            left: 0

    .grid-icon
        z-index: 0
</style>

<template>
    <div class="home-page">
        <div class="home-block">
            <h1>订单管理</h1>
            <van-grid class="home-layout" :border="false" :column-num="4">
                <van-grid-item :to="{name:'home.purchaseList', query: {type: 'order'}}">
                    <van-image class="grid-image" :src="pngPurchase" />
                    <label>采购单</label>
                </van-grid-item>
                <van-grid-item :to="{name:'home.tempList'}">
                    <van-image class="grid-image" :src="pngAdd" />
                    <label>临时加单</label>
                </van-grid-item>
                <van-grid-item :to="{name:'home.orderList'}">
                    <van-image class="grid-image" :src="pngReserve" />
                    <label>明日预定</label>
                </van-grid-item>
            </van-grid>
        </div>

        <div class="home-block">
            <h1>业务处理</h1>
            <van-grid class="home-layout" :border="false" :column-num="4">
                <van-grid-item :to="{name:'home.onlineIn', query: {type: 'order'}}">
                    <van-image class="grid-image" :src="pngRecord"/>
                    <label>在线录单</label>
                </van-grid-item>
                <van-grid-item :to="{name:'home.myPrice'}">
                    <van-image class="grid-image" :src="pngQuote"/>
                    <label>商品报价</label>
                </van-grid-item>
                <van-grid-item :to="{name:'home.newNotice'}">
                    <van-image class="grid-image" :src="pngNew"/>
                    <label>新品提报</label>
                </van-grid-item>
                <van-grid-item :to="{name: 'home.promotion'}">
                    <van-image class="grid-image" :src="pngCuxiao"/>
                    <label>促销申请</label>
                </van-grid-item>
                <van-grid-item :to="{name: 'home.upAndDownProduct'}">
                    <van-image class="grid-image" :src="pngShangjia"/>
                    <label>上下架申请</label>
                </van-grid-item>
                <van-grid-item :to="{name: 'home.refundNotify'}">
                    <div class="grid-info">
                        <van-icon class="grid-icon" :info="countText"/>
                        <van-image class="grid-image" :src="pngNotification"/>
                    </div>
                    <label>退货通知</label>
                </van-grid-item>
            </van-grid>
        </div>

        <div class="home-block">
            <h1>经营管理</h1>
            <van-grid class="home-layout" :border="false" :column-num="4">
                <van-grid-item :to="{name:'home.statistics'}">
                    <van-image class="grid-image" :src="pngStatistics"/>
                    <label>数据统计</label>
                </van-grid-item>
                <van-grid-item :to="{name:'home.bill'}">
                    <van-image class="grid-image" :src="pngBill"/>
                    <label>验货单</label>
                </van-grid-item>
                <van-grid-item :to="{name:'home.statement'}">
                    <van-image class="grid-image" :src="pngStatement"/>
                    <label>对账单</label>
                </van-grid-item>
                <van-grid-item :to="{name:'home.setting'}">
                    <van-image class="grid-image" :src="pngSetting"/>
                    <label>设置</label>
                </van-grid-item>
            </van-grid>
        </div>

        <app-footer />
    </div>
</template>

<script>
    import pngPurchase from '../../assets/home/purchase.png';
    import pngAdd from '../../assets/home/add.png';
    import pngNew from '../../assets/home/new.png';
    import pngNotification from '../../assets/home/notification.png';
    import pngQuote from '../../assets/home/quote.png';
    import pngRecord from '../../assets/home/record.png';
    import pngReserve from '../../assets/home/reserve.png';
    import pngSetting from '../../assets/home/setting.png';
    import pngStatistics from '../../assets/home/statistics.png';
    import pngShangjia from '../../assets/home/shangjia.png';
    import pngCuxiao from '../../assets/home/cuxiao.png';
    import pngBill from '../../assets/home/bill.png';
    import pngStatement from '../../assets/home/statement.png';
    import AppFooter from '../AppFooter';
    import { overview } from '../../api';

    export default {
        name: 'HomePage',
        data () {
            return {
                count: null,
                pngPurchase,
                pngAdd,
                pngNew,
                pngNotification,
                pngQuote,
                pngRecord,
                pngReserve,
                pngSetting,
                pngStatistics,
                pngShangjia,
                pngCuxiao,
                pngBill,
                pngStatement,
                popupVisible: false
            };
        },
        activated () {
            overview().success(({ return_notice_count: count = null }) => {
                this.count = count;
            });
        },
        computed: {
            countText () {
                return this.count > 9 ? '9+' : (this.count || null);
            }
        },
        components: {
            AppFooter
        }
    };
</script>
