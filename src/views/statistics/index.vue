<style lang="sass" scoped>
    @import "~style/var"

    header
        overflow: hidden
        padding: .6rem 0
        background-color: #fff

        .total
            text-align: center
            color: #666
            line-height: 1
            font-size: $normal
            width: 50%
            float: left
            box-sizing: border-box
            position: relative

            &:nth-child(1):after
                content: ""
                height: 1.24rem
                width: 1px
                background-color: $borderColor
                position: absolute
                top: 0
                bottom: 0
                margin: auto
                right: 0

            h1
                font-size: .48rem
                color: #000
                margin: .3rem 0
                font-weight: normal

    .nav-bar
        background-color: #fff
        padding-top: $space
</style>

<template>
    <section style="width: 100%; background-color: #f6f6f6">
        <header>
            <div class="total">
                <p>本月销售额</p>
                <h1>{{data.month_sales_value || 0 | money | thousands}}</h1>
                <p>上月{{data.last_month_sales_value || 0 | money | thousands}}</p>
            </div>
            <div class="total">
                <p>本月客户数</p>
                <h1>{{data.month_store_count || 0 | thousands}}</h1>
                <p>上月客户数 {{data.last_month_store_count || 0 | thousands}}</p>
            </div>
        </header>
        <div class="nav-bar mt">
            <mt-navbar v-model="type">
                <mt-tab-item id="sale">销售额</mt-tab-item>
                <mt-tab-item id="customer">客户数</mt-tab-item>
                <mt-tab-item id="sku">SKU销量</mt-tab-item>
                <mt-tab-item id="stock">缺货统计</mt-tab-item>
                <mt-tab-item id="refund">退货统计</mt-tab-item>
            </mt-navbar>

        </div>
        <div class="container">
            <component :is="componentsMap[type]"></component>
        </div>
    </section>
</template>

<script>
    import StatisticSales from './sales';
    import StatisticSku from './sku';
    import StatisticCustomer from './customer';
    import StatisticStock from './stock';
    import StatisticRefund from './refund';
    import { statisticsOverview } from '../../api';

    export default {
        name: 'index',
        data () {
            const { type = 'sale' } = this.$route.params;

            return {
                type,
                data: {},
                componentsMap: {
                    sale: 'StatisticSales',
                    customer: 'StatisticCustomer',
                    sku: 'StatisticSku',
                    stock: 'StatisticStock',
                    refund: 'StatisticRefund'
                }
            };
        },
        components: {
            StatisticSales,
            StatisticSku,
            StatisticCustomer,
            StatisticStock,
            StatisticRefund
        },
        created () {
            statisticsOverview().success(data => {
                this.data = data;
            }).error(() => {});
        }
    };
</script>
