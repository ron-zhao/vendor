<style lang="sass" scoped rel="stylesheet/sass">
    @import '../../common/sass/var.sass'
    @import '../../common/sass/reset.sass'
    .order-list
        height: 100%
        padding-bottom: 0.2rem
        p
            margin: 0.6rem 2% 0.4rem 2%

</style>

<template>
    <div>
        <div class="viewports order-list">
            <p>提醒：这只是当前数据，可能会有变动。如果当前库存少于预订量，请及时与我们联系。</p>
            <table class="table">
                <thead>
                    <tr>
                        <td>商品名称</td>
                        <td>预订量</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-show='!loadall'>
                        <td colspan="2">
                            <div class="text-center load-more padder" >
                                <mt-spinner :type="3"></mt-spinner>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="(item,index) in orders" v-show="orders.length">
                        <td>{{item.product_name}}</td>
                        <td>
                            {{item.quantity + item.spec}}
                            <span v-show="item.spec !== item.ud">{{item.ud_quantity + item.ud}}</span>
                        </td>
                    </tr>
                    <tr v-show="loadall && !orders.length">
                        <td colspan="2">暂无数据</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { orders } from '../../api';

    export default {
        data () {
            return {
                orders: [],
                loadall: false
            };
        },
        beforeCreate () {

        },
        mounted () {
            this.list();
        },
        methods: {
            list () {
                this.orders = [];
                orders().success(data => {
                    this.orders = data;
                    this.loadall = true;
                });
            }
        },
        watch: {

        }
    };
</script>
